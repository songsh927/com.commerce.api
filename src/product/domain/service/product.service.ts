import { Injectable } from '@nestjs/common';
import { product } from '@prisma/client';
import { ProductRepository } from 'src/product/infra/product.repository';

@Injectable()
export class ProductService {

    constructor(
        private readonly productRepository : ProductRepository
    ){}

    async findAllByPage(page : number) : Promise<product[]>{
        return await this.productRepository.getProductsByPage(page);
    }

    async findOneById(id : number){
        return await this.productRepository.getProductById(id);
    }
}
