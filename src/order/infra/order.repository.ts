import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/db/prisma.service";
import { Prisma, order } from "@prisma/client";
import { CreateOrderDto } from "../domain/dto/CreateOrderDto"


@Injectable()
export class OrderRepository{
    constructor(private readonly prisma : PrismaService){}

    async getOrderById(id : number) : Promise<order>{
        const orderInfo : order = await this.prisma.order.findUnique({
            where : {id : id}
        });

        return orderInfo;
    }

    async createOrder(createOrderDto : CreateOrderDto) : Promise<order>{
        const orderData = CreateOrderDto.to(createOrderDto);
        const orderInfo: order = await this.prisma.order.create({
            data : orderData
        });

        return orderInfo;
    }



}