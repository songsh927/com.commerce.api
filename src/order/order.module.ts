import { Module } from '@nestjs/common';
import { OrderService } from './domain/service/order.service';
import { OrderController } from './presentation/controller/order.controller';
import { PrismaModule } from 'src/common/db/prisma.module';
import {OrderRepository} from './infra/order.repository';
import { OrderDetailRepository } from './infra/order.detail.repository';
import { CartRepository } from 'src/cart/infra/cart.repository';
import { ProductRepository } from 'src/product/infra/product.repository';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    OrderDetailRepository,
    CartRepository,
    ProductRepository,
  ],
})
export class OrderModule {}
