import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from 'src/product/domain/service/product.service';

@Controller('product')
export class ProductController {

    constructor(private readonly productService : ProductService){}
    
    @Get(':page')
    findAllByPage(@Param('page') page : string){
        // return this this.productService
    }

    @Get('id')
    findById(@Param('id') id : string){
        return this.productService.findOneById(+id)
    }

}
