import { Injectable } from '@nestjs/common';
import { CreateCartDto, CreateResultCartDto } from '../dto/CreateCartDto';
// import { CartRepository } from 'src/cart/infra/cart.repository';
import { CartRedisRepository } from 'src/cart/infra/cart.redis.repository';
// import { cart } from '@prisma/client';
import { CartEntity } from '../entity/cart.entity';
import { KafkaCartDto } from 'src/cart/presentation/dto/kafka-cart.dto';

@Injectable()
export class CartService {

    constructor(
        // private readonly cartRepository : CartRepository
        private readonly cartRepository : CartRedisRepository // Redis 기반으로 리팩토링
    ){}

    async create(createCartDto : CreateCartDto) : Promise<boolean>{

        await this.cartRepository.createCart(createCartDto);
        return true;
    }

    async findOne(id : number) : Promise<CartEntity[]>{

        return await this.cartRepository.getCartById(id);

    }

    async cartForOrder(kafkaCartDto : KafkaCartDto) : Promise<boolean>{
        this.cartRepository.deleteCarts(kafkaCartDto.customerId);

        return true;
    }

}
