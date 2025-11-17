import { Module } from '@nestjs/common';
import { ProductService } from './domain/service/product.service';
import { ProductController } from './presentation/controller/product.controller';
import { PrismaModule } from 'src/common/db/prisma.module';
import { ProductRepository } from './infra/product.repository';

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
})
export class ProductModule {}
