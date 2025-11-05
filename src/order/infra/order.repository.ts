import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/db/prisma.service";
import { Prisma, order } from "@prisma/client";
import { CreateOrderDto } from "../domain/dto/create-order.dto"


@Injectable()
export class OrderRepository {
	constructor(
		private readonly prisma: PrismaService
	) { }

	async getOrderById(id: number): Promise<order> {
		const orderInfo: order = await this.prisma.order.findUnique({
			where: { id: id },
		});
		return orderInfo;
	}

	async createOrder(createOrdertDto: CreateOrderDto, tx: Prisma.TransactionClient = this.prisma): Promise<boolean> {
		const orderData = CreateOrderDto.to(createOrdertDto);
		await tx.order.create({
			data: orderData,
		});
		return true;
	}
}