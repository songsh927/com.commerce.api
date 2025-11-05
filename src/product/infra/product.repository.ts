import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, product } from "@prisma/client";

@Injectable()
export class ProductRepository {

    constructor(private readonly prisma : PrismaService){}

    async getProductById(id : number) : Promise<product>{

        const productInfo : product = await this.prisma.product.findUnique({
            where : {id : id}
        });

        return productInfo;
    }

    async getProductByIds(ids : number[]) : Promise<product[]>{

        const productInfos : product[] = await this.prisma.product.findMany({
            where : {
                id : {
                    in : ids
                }
            }
        })

        return productInfos;
    }

}