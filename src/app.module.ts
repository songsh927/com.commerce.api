import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { RedisModule } from './common/db/redis.module'

@Module({
  imports: [CartModule, OrderModule, ProductModule, RedisModule],
})
export class AppModule {}
