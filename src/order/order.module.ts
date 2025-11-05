import { Module } from '@nestjs/common';
import { OrderService } from './domain/service/order.service';
import { OrderController } from './presentation/controller/order.controller';
import { PrismaModule } from 'src/common/db/prisma.module';
import {OrderRepository} from './infra/order.repository';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
