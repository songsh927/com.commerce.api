import { Injectable } from '@nestjs/common';
import {CreateRequestOrderDto} from 'src/order/presentation/dto/create.order.dto';
import {CreateResultOrderDto} from '../dto/create-order..dto'
import { CartRepository } from 'src/cart/infra/cart.repository';
import { PrismaService } from 'src/common/db/prisma.service';
import {productRepository} from 'src/product/infra/repository/product.repository';

@Injectable()
export class OrderService {

    constructor(
        private readonly cartRepository: CartRepository,
        private readonly 
        private readonly prisma: PrismaService
    ){}

    async create(createRequestOrderDto : CreateRequestOrderDto) : Promise<CreateResultOrderDto>{
        const {customerId} = createRequestOrderDto;

        const cartInfo = await this.cartRepository.getCartByCustomerIds(customerId);

        if(!cartInfo || cartInfo.length == 0){
            throw new Error('장바구니 정보가 없습니다.')
        }
        
        const result : boolean = await this.prisma.$transaction(async (tx) => {
            this.cartRepository.deleteCarts(customerId, tx);

            const productIds = cartInfo.map((item) => item.product_id);

            const products = 

        })

        return;
    }

}
