import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/db/prisma.service';
import { order, ordersDetail, Prisma } from '@prisma/client';
import { CreateOrderDetailDto } from '../domain/dto/create-order.detail.dto';


@Injectable()
export class OrderDetailRepository {
  constructor(
    private readonly prisma: PrismaService,

  ) {}

    async getOrderDetailById(id: number): Promise<ordersDetail> {
      const orderDetailInfo : ordersDetail = await this.prisma.ordersDetail.findUnique({
        where: { id: id },
      });
      return orderDetailInfo;   
    }

    async createOrderDetail(createOrdertDetailDto: CreateOrderDetailDto, tx: Prisma.TransactionClient = this.prisma): Promise<boolean> {
    
      const orderDetailData = CreateOrderDetailDto.to(createOrdertDetailDto);
      await tx.ordersDetail.create({
        data: orderDetailData,
      });
      return true;   
    }
}