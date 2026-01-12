import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from '../../domain/service/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { KafkaCartDto } from '../dto/kafka-cart.dto';
  
@Controller('cart')
export class CartController {

    constructor(
        private readonly cartService: CartService
    ) {}
  
    @Post()
    create(@Body() createCartDto: CreateCartDto) {
        return this.cartService.create(createCartDto);
    }
  
    @EventPattern('cart.delete')
    orderCollect(@Payload() data : KafkaCartDto, @Ctx() context: KafkaContext){
        this.cartService.cartForOrder(data);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cartService.findOne(+id);
    }
}