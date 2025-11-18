import { Injectable } from "@nestjs/common";
import { CreateCartDto } from "../domain/dto/CreateCartDto";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
import { CartEntity } from '../domain/entity/cart.entity';

@Injectable()
export class CartRedisRepository{
    constructor(@InjectRedis() private readonly redis : Redis){}

    async getCartByCustomerIds(customerId : number) : Promise<CartEntity[]> {
        const cartKey = `commerceCart:${customerId}`;
        const carts = await this.redis.hgetall(cartKey);

        const cartInfo : CartEntity[] = Object.keys(carts).map((productKey) => {
            const [unitPrice, qty] = carts[productKey].split(':');

            if(!productKey || !productKey.includes(':')){
                return null;
            }

            return {
                customer_id : customerId,
                product_id : Number(productKey.split(':')),
                unit_price : Number(unitPrice),
                qty : Number(qty)
            };
        })

        return cartInfo;
    }

    async deleteCarts(customerId : number) : Promise<void>{
        const cartKey = `commerceCart:${customerId}`;
        const productKeys = await this.redis.hkeys(cartKey);

        if(productKeys.length > 0){
            await this.redis.hdel(cartKey, ...productKeys);
        }

    }

    async createCart(createCartDto : CreateCartDto) : Promise<void> {

        const cartKey = `commerceCart:${createCartDto.customerId}`;
        const productKey = `commerceProductWith:${createCartDto.productId}`;

        const existingItem = await this.redis.hget(cartKey, productKey);

        if(existingItem){
            const [existingUnitPrice, existingQty] = existingItem
                .split(':')
                .map(Number);

                if(existingUnitPrice === createCartDto.unitPrice){
                    const updatedQty = existingQty + createCartDto.qty;
                    await this.redis.hset(
                        cartKey,
                        productKey,
                        `${createCartDto.unitPrice}:${updatedQty}`
                    )
                } else {
                    await this.redis.hset(
                        cartKey,
                        productKey,
                        `${createCartDto.unitPrice}:${createCartDto.qty}`
                    )
                }
        } else {
            await this.redis.hset(
                cartKey,
                productKey,
                `${createCartDto.unitPrice}:${createCartDto.qty}`
            )
        }

        const ttl = 3600;
        await this.redis.expire(cartKey, ttl);

    }

}
