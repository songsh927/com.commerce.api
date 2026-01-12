import { Injectable, Inject } from '@nestjs/common';
import {CreateRequestOrderDto} from 'src/order/presentation/dto/create.order.dto';
import {CreateOrderDto, CreateResultOrderDto} from '../dto/create-order.dto'
// import { CartRepository } from 'src/cart/infra/cart.repository';
import { CartRedisRepository } from 'src/cart/infra/cart.redis.repository';
import { PrismaService } from 'src/common/db/prisma.service';
import { ProductRepository } from 'src/product/infra/product.repository';
import { OrderRepository } from 'src/order/infra/order.repository';
import {OrderDetailRepository} from 'src/order/infra/order.detail.repository'
import { CreateOrderDetailDto } from '../dto/create-order.detail.dto';
import { KafkaCartDto } from 'src/cart/presentation/dto/kafka-cart.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderService {

    constructor(
        // private readonly cartRepository: CartRepository,
        private readonly cartRepository: CartRedisRepository,
        private readonly productRepository: ProductRepository,
        private readonly orderRepository : OrderRepository,
        private readonly orderDetailRepository : OrderDetailRepository,
        private readonly prisma: PrismaService,
        @Inject('order-kafka') private readonly kafkaProducer:ClientKafka
    ){}

    async create(createRequestOrderDto : CreateRequestOrderDto) : Promise<CreateResultOrderDto>{
        const {customerId} = createRequestOrderDto;

        const cartInfo = await this.cartRepository.getCartByCustomerIds(customerId);

        if(!cartInfo || cartInfo.length == 0){
            throw new Error('장바구니 정보가 없습니다.')
        }
        
        const result : boolean = await this.prisma.$transaction(async (tx) => {
            // RDBMS에서 Redis로 리팩토링 => 주문완료 후 카트정보 삭제로 변경
            // this.cartRepository.deleteCarts(customerId, tx);

            const productIds = cartInfo.map((item) => item.product_id);

            const products = await this.productRepository.getProductByIdsWithLock(productIds, tx);

            let totalPrice = 0;
            const orderDetails : CreateOrderDetailDto[] = [];
            for(const cart of cartInfo){
                const product = products.find((p) => p.id === cart.product_id);

                if(!product){
                    throw new Error(`상품 ID ${cart.product_id}를 찾을 수 없습니다.`);
                }

                if(product.qty < cart.qty){
                    throw new Error(`상품 ${product.id}의 재고가 부족합니다.`);
                }

                totalPrice += cart.unit_price * cart.qty;

                await this.productRepository.updateProductByIds(product.id, cart.qty, tx);

                orderDetails.push({
                    order_no : '',
                    product_id : product.id,
                    unit_price : cart.unit_price,
                    qty : cart.qty,
                    created_at : new Date(),
                    updated_at : null
                });
            }

            const orderNo = `Order-${Date.now()}`;
            const createOrderDto = new CreateOrderDto();

            createOrderDto.customerId = customerId;
            createOrderDto.orderNo = orderNo;
            createOrderDto.totalPrice = totalPrice;
            createOrderDto.status = '주문완료';
            createOrderDto.createdAt = new Date();
            createOrderDto.updatedAt = new Date();

            await this.orderRepository.createOrder(createOrderDto, tx);

            for (const detail of orderDetails) {
                const detailWithOrderNo = {...detail, order_no : orderNo};
                await this.orderDetailRepository.createOrderDetail(detailWithOrderNo, tx);
            }

            return true;
        });

        if(result){
            // await this.cartRepository.deleteCarts(customerId);
            // Kafka produce 이벤트 실행
            const id : number = customerId;
            const kafkaCartDto : KafkaCartDto = {customerId : id};
            await this.kafkaProducer.emit('cart.delete', kafkaCartDto)
        }

        return new CreateResultOrderDto({
            id : customerId,
            isSuccess : result
        })
    }

    async findOne(id : number){
        return await this.orderRepository.getOrderById(id);
    }

}
