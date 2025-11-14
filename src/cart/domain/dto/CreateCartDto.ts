import { cart } from '@prisma/client';

export class CreateCartDto {
    customerId: number
    productId: number 
    unitPrice: number 
    qty: number 
    createdAt: Date 
    updatedAt: Date | null

    //prisma 형식에 맞도록 수정
    static to(dto: CreateCartDto) {
        return {  
          customer_id:dto.customerId,
          product_id: dto.productId,
          unit_price: dto.unitPrice,
          qty: dto.qty,
          created_at: new Date(dto.createdAt),
          updated_at: new Date(dto.updatedAt),
        };
    }
}

export class CreateResultCartDto{
    id: number
    customerId: number
    productId: number 
    unitPrice: number 
    qty: number 
    createdAt: Date 
    updatedAt: Date | null

    // Prisma 엔티티를 DTO로 변환
    static of(prismaCart: cart): CreateResultCartDto {
        return {
            id: prismaCart.id,
            customerId: prismaCart.customer_id,
            productId: prismaCart.product_id!,
            unitPrice: prismaCart.unit_price!,
            qty: prismaCart.qty!,
            createdAt: prismaCart.created_at!,
            updatedAt: prismaCart.updated_at,
        };
    }
}