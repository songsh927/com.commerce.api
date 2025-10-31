import { order } from "@prisma/client";

export class CreateOrderDto{
    customerId : number
    orderNo : string
    totalPrice : number
    status : string
    createdAt : Date
    updatedAt : Date

    static to(dto : CreateOrderDto){
        return {
            customer_id : dto.customerId,
            order_no : dto.orderNo,
            total_price : dto.totalPrice,
            status : dto.status,
            created_at : new Date(dto.createdAt),
            updated_at : new Date(dto.updatedAt)
        }
    }
}