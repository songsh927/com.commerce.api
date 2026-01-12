import { Module } from '@nestjs/common';
import { OrderService } from './domain/service/order.service';
import { OrderController } from './presentation/controller/order.controller';
import { PrismaModule } from 'src/common/db/prisma.module';
import {OrderRepository} from './infra/order.repository';
import { OrderDetailRepository } from './infra/order.detail.repository';
import { CartRepository } from 'src/cart/infra/cart.repository';
import { CartRedisRepository } from 'src/cart/infra/cart.redis.repository';
import { ProductRepository } from 'src/product/infra/product.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
    imports: [
        PrismaModule, 
        ClientsModule.register([
            {
                name : 'order-kafka',
                transport : Transport.KAFKA,
                options : {
                    client : {
                        clientId: 'commerce-server',
                        brokers : process.env.KAFKA_BROKER.split(',')
                    },
                    producer : {
                        allowAutoTopicCreation : true,
                        createPartitioner: Partitioners.LegacyPartitioner,
                        retry : {retries : 3, initialRetryTime : 1000, multiplier: 1.5},
                        send: {
                            acks: 1, 
                        }
                    }
                }
            }
        ])
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        OrderRepository,
        OrderDetailRepository,
        CartRepository,
        ProductRepository,
        CartRedisRepository
    ],
})

export class OrderModule {}
