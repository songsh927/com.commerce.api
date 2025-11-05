import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { Prisma, product } from '@prisma/client';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getProductById(id: number): Promise<product> {
        const productInfo: product = await this.prisma.product.findUnique({
            where: { id: id },
        });
        return productInfo;
    }

    async getProductByIds( productIds: Array<number>, tx: Prisma.TransactionClient = this.prisma): Promise<product[]> {
        const productInfo = await tx.product.findMany({
            where: { id: { in: productIds } },
        });
    
        return productInfo;
    }

    async getProductByIdsWithLock( 
        productIds: Array<number>, 
        tx: Prisma.TransactionClient = this.prisma
    ): Promise<product[]> {
    
        const productInfo = await tx.$queryRaw<product[]>`
        SELECT * FROM product WHERE id IN (${Prisma.join(productIds)}) FOR UPDATE;`;

        return productInfo;
    }

    async updateProductByIds(
        productId: number,
        qty: number,
        tx: Prisma.TransactionClient = this.prisma
    ) {
        await tx.product.update({
            where: { id: productId },
            data: {
                qty: {
                decrement: qty,
                },
            },
        });
    }
}