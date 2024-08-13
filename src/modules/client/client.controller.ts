/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './dto/client-dto';

@Controller('api/v1/clients')
export class ClientController {

    constructor(private clientService: ClientService){}

    @Post()
    createClient(@Body() client:ClientDto){
        return this.clientService.createClient(client);
    }

    @Get()
    getClients(){
        return this.clientService.getClients();
    }

    @Get('/:id')
    getClientById(@Param('id') id: number) {
        return this.clientService.getClientById(id);
    }

    @Put()
    updateClient(@Body() client: ClientDto){
        return this.clientService.updateClient(client);
    }
}
