import { Module } from '@nestjs/common';
import { CartService } from './domain/service/cart.service';
import { CartController } from './presentation/controller/cart.controller';
import { PrismaModule } from 'src/common/db/prisma.module';
import { CartRepository } from './infra/cart.repository';

@Module({
  imports : [PrismaModule],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}
