/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ProductDto } from './dto/product-dto';
import { StockDto } from './dto/stock-dto';

@Injectable()
export class ProductService {

    private MIN_STOCK: number = 0;
    private MAX_STOCK: number = 1000;

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ){
        
    }

    async createProduct(product: ProductDto){

        const productExists: ProductDto =  await this.findProduct(product.id);

        if(productExists){
            throw new ConflictException('el producto con el id '+ product.id + ' existe');
        }

        return await this.productRepository.save(product);
    }

    async findProduct(id: number){
        
        return await this.productRepository.findOne({
            where: { id },
        });
    }

    async findAll(){
        return await this.productRepository.find({
            where: {deleted:false}
        });
    }

    async findAllDeleted(){
        return await this.productRepository.find({
            where:{deleted:true}
        });
    }

    async updateProduct(product: ProductDto){
        return await this.productRepository.save(product)        
    }

    async softDelete(id: number){

        const productExists: ProductDto =  await this.findProduct(id);

        if(!productExists){
            throw new ConflictException('el producto con el id '+ id + ' no existe');
        }

        if(productExists.deleted){
            throw new ConflictException('el producto ya fue borrado');
        }

        const rows: UpdateResult = await this.productRepository.update(
            {id},
            {deleted: true}
        )

        return rows.affected == 1;
    }

    async restoreProduct(id:number){

        const productExists: ProductDto =  await this.findProduct(id);

        if(!productExists){
            throw new ConflictException('el producto con el id '+ id + ' no existe');
        }

        if(!productExists.deleted){
            throw new ConflictException('el producto no esta borrado');
        }

        const rows: UpdateResult = await this.productRepository.update(
            {id},
            {deleted: false}
        )

        return rows.affected == 1;
    }

    async updateStock(s: StockDto){

        const product: ProductDto = await this.findProduct(s.id);

        if(!product){
            throw new ConflictException('el producto con el id '+ s.id +' no existe');
        }

        if(product.deleted){
            throw new ConflictException('el producto con el id '+ s.id +' esta borrado');
        }

        const rows: UpdateResult = await this.productRepository.update(
            {id: s.id},
            {stock: s.stock}
        )

        return rows.affected == 1;
    }

    async incrementStock(s: StockDto){
        
        const product: ProductDto = await this.findProduct(s.id);

        if(!product){
            throw new ConflictException('el producto con el id '+ s.id +' no existe');
        }

        if(product.deleted){
            throw new ConflictException('el producto con el id '+ s.id +' esta borrado');
        }
        
        let stock = 0;
        if(s.stock + product.stock > this.MAX_STOCK){
            stock = this.MAX_STOCK;
        }else{
            stock = s.stock + product.stock;
        }

        const rows: UpdateResult = await this.productRepository.update(
            {id: s.id},
            {stock}
        )
        return rows.affected == 1;

    }

    async decrementStock(s: StockDto){
        
        const product: ProductDto = await this.findProduct(s.id);

        if(!product){
            throw new ConflictException('el producto con el id '+ s.id +' no existe');
        }

        if(product.deleted){
            throw new ConflictException('el producto con el id '+ s.id +' esta borrado');
        }
        
        let stock = 0;
        if(product.stock - s.stock < this.MIN_STOCK){
            stock = this.MIN_STOCK;
        }else{
            stock = product.stock - s.stock;
        }

        const rows: UpdateResult = await this.productRepository.update(
            {id: s.id},
            {stock}
        )
        return rows.affected == 1;

    }
}
