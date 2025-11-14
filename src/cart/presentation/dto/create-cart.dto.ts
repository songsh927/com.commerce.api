

export class CreateCartDto {
    customerId: number
    productId: number 
    unitPrice: number 
    qty: number 
    createdAt: Date 
    updatedAt: Date | null
}