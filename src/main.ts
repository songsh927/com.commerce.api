import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './middleware/logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new LoggerInterceptor());
    app.connectMicroservice<MicroserviceOptions>({
        transport : Transport.KAFKA,
        options : {
            client : {
                clientId : 'commerce-server',
                brokers : process.env.KAFKA_BROKER.split(',')
            },
            consumer : {
                groupId : 'commerce-group',
            }
        }
    })

    await app.startAllMicroservices();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
