import { Module } from '@nestjs/common';
import { CartService } from './domain/service/cart.service';
import { CartController } from './presentation/controller/cart.controller';
import { PrismaModule } from 'src/common/db/prisma.module';
import { CartRepository } from './infra/cart.repository';
import { CartRedisRepository } from './infra/cart.redis.repository';
import { RedisModule } from 'src/common/db/redis.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
  imports : [
    PrismaModule,
    ClientsModule.register([
            {
                name : 'cart-kafka',
                transport : Transport.KAFKA,
                options : {
                    client : {
                        clientId: 'commerce-server',
                        brokers : process.env.KAFKA_BROKER.split(',')
                    },
                    consumer: {
                      groupId : 'consumer-group'
                    }
                }
            }
        ])
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartRedisRepository, RedisModule],
})
export class CartModule {}
