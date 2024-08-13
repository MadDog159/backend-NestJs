/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import { ConflictException, Injectable } from '@nestjs/common';
import { Client } from './entity/client.entity';
import { ClientDto } from './dto/client-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entity/address.entity';

@Injectable()
export class ClientService {

    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
    ){}

    findClient(client: ClientDto){
        return this.clientRepository.findOne({
            where: [
                {id: client.id},
                {email: client.email}
            ]
        });
    }

    findClientByEmail(email: string){
        return this.clientRepository.findOne({
            where: 
                {email}
        });
    }

    async createClient(client:ClientDto){

        const clientExist = await this.findClient(client);
        
        if(clientExist){
            if(client.id){
                throw new ConflictException('El cliente con id '+ client.id + ' existe')
            }else{
                throw new ConflictException('El cliente con email '+ client.email + ' existe')
            }
        }

        let addressExists: Address = null;
        if(client.address.id){
            addressExists = await this.addressRepository.findOne({
                where: {
                    id: client.address.id
                }
            });
        }else{
            addressExists = await this.addressRepository.findOne({
                where: {
                    country: client.address.country,
                    province: client.address.province,
                    town: client.address.town,
                    street: client.address.street
                }
            });
        }

        if(addressExists){
            throw new ConflictException('La dirección ya existe')
        }


        return this.clientRepository.save(client);
    }

    getClients(){
        return this.clientRepository.find();
    }

    getClientById(id:number){
        return this.clientRepository.findOne({
            where: {id}
        });
    }

    async updateClient(client: ClientDto){

        if(!client.id){
            return this.createClient(client)
        }

        let clientExists = await this.findClientByEmail(client.email);

        if(clientExists && clientExists.id != client.id){
            throw new ConflictException('El cliente con email '+ client.email + ' existe')
        }

        clientExists = await this.getClientById(client.id);

        let addressExists: Address = null;
        let deleteAddress = false;
        if(client.address.id){
            addressExists = await this.addressRepository.findOne({
                where: {
                    id: client.address.id
                }
            });

            if(addressExists && addressExists.id != clientExists.address.id){
                throw new ConflictException('La dirección ya existe')
            }else if(JSON.stringify(addressExists) != JSON.stringify(client.address)){
                addressExists = await this.addressRepository.findOne({
                    where: {
                        country: client.address.country,
                        province: client.address.province,
                        town: client.address.town,
                        street: client.address.street
                    }
                });
                if(addressExists){
                    throw new ConflictException('La dirección ya existe')
                }else{
                    deleteAddress = true;
                }
            }

        }else{
            addressExists = await this.addressRepository.findOne({
                where: {
                    country: client.address.country,
                    province: client.address.province,
                    town: client.address.town,
                    street: client.address.street
                }
            });

            if(addressExists){
                throw new ConflictException('La dirección ya existe')
            }else{
                deleteAddress = true;
            }
        }

        const updateClient = await this.clientRepository.save(client);

        if(deleteAddress){
            await this.addressRepository.delete({id: clientExists.address.id});
        }

        return updateClient; 
    }

    async deleteClient(id: number){

        const clientExists = await this.getClientById(id);

        if(!clientExists){
            throw new ConflictException('El cliente con el id '+ id +' no existe');
        }

        const rows = await this.clientRepository.delete({ id })

        if(rows.affected == 1){
            await this.addressRepository.delete({ id: clientExists.address.id })
            return true
        }

        return false;
    }
}
