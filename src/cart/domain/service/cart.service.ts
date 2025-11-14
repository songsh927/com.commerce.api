import { Injectable } from '@nestjs/common';
import { CreateCartDto, CreateResultCartDto } from '../dto/CreateCartDto';
import { CartRepository } from 'src/cart/infra/cart.repository';
import { cart } from '@prisma/client';

@Injectable()
export class CartService {

    constructor(
        private readonly cartRepository : CartRepository
    ){}

    async create(createCartDto : CreateCartDto) : Promise<boolean>{

        await this.cartRepository.createCart(createCartDto);
        return true;
    }

    async findOne(id : number) : Promise<CreateResultCartDto>{

        const cartInfo : cart =  await this.cartRepository.getCartById(id);

        return CreateResultCartDto.of(cartInfo);
    }

    async cartForOrder(){

    }

}
