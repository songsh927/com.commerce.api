import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from 'src/product/domain/service/product.service';

@Controller('product')
export class ProductController {

    constructor(private readonly productService : ProductService){}
    
    @Get()
    findAllByPage(@Query('page') page : string){
        if(!page){
            page = '1';
        }
        return this.productService.findAllByPage(+page);
    }

    @Get(':id')
    findById(@Param('id') id : string){
        return this.productService.findOneById(+id);
    }

}
