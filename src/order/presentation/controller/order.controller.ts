import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from 'src/order/domain/service/order.service';
import { CreateRequestOrderDto } from '../dto/create.order.dto';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService : OrderService){}

    @Post()
    create(@Body() createRequestOrderDto : CreateRequestOrderDto){
        return this.orderService.create(createRequestOrderDto);
    }

    @Get(':id')
    findOne(@Param('id') id : string){
        return this.orderService.findOne(+id)
    }

}
