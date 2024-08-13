/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product-dto';
import { StockDto } from './dto/stock-dto';

@Controller('api/v1/products')
@ApiTags('productos')
export class ProductController {

    constructor(private ProductService: ProductService){

    }

    @Post()
    @ApiOperation({
        description: 'Crear un producto',
    })
    @ApiBody({
        description: 'Crea un producto mediante un ProductoDto',
        type: ProductDto,
        examples:{
            ejemplo1:{
                value:{
                    "id": 1,
                    "name": "producto 1",
                    "price": 50,
                    "stock": 20,
                }
            },
            ejemplo2:{
                value:{
                    "name": "producto 2",
                    "price": 50,
                    "stock": 20,
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Producto creado correctamente.',
    })
    @ApiResponse({
        status: 409,
        description: 'El producto existe',
    })
    createProduct(@Body() product: ProductDto){
        return this.ProductService.createProduct(product)
    }

    @Get()
    @ApiOperation({
        description: 'Obtener todos los productos no borrados',
    })
    @ApiResponse({
        status: 200,
        description: 'Se devuelve la informacion',
    })
    getProducts(){
        return this.ProductService.findAll();
    }

    @Get('/deleted')
    @ApiOperation({
        description: 'Obtener todos los productos borrados',
    })
    @ApiResponse({
        status: 200,
        description: 'Se devuelve la informacion',
    })
    getDeletedProducts(){
        return this.ProductService.findAllDeleted();
    }

    @Get('/:id')
    @ApiOperation({
        description: 'Obtener un producto por id',
    })
    @ApiParam({
        name: 'id',
        description:'id del producto',
        required: true,
        type: Number
    })
    @ApiResponse({
        status: 200,
        description: 'Se devuelve la informacion',
    })
    getProductById(@Param('id') id:number){
        return this.ProductService.findProduct(id);
    }

    @Put()
    @ApiOperation({
        description: 'Actualiza un producto, sino existe se crea.',
    })
    @ApiParam({
        name: 'id',
        required:true,
        description: 'id del producto',
        type: Number
    })
    @ApiBody({
        description: 'Actualiza un producto mediante un ProductoDto, sino existe se crea.',
        type: ProductDto,
        examples:{
            ejemplo1:{
                value:{
                    "id": 7,
                    "name": "producto 19",
                    "price": 500,
                    "stock": 30,
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Se ha actualizado correctamente',
    })
    updateProduct(@Body() product: ProductDto){
        return this.ProductService.updateProduct(product);
    }

    @Delete('/:id')
    @ApiOperation({
        description: 'Borra un producto, (borrado suave)',
    })
    @ApiParam({
        name: 'id',
        description: 'id del producto',
        required: true,
        type: Number
    })
    @ApiResponse({
        status: 200,
        description: 'Se ha borrado correctamente',
    })
    @ApiResponse({
        status: 409,
        description: `El producto no existe. <br />
        El producto esta ya borrado. <br />`
    })
    deleteProduct(@Param('id') id:number){
        return this.ProductService.softDelete(id);
    }

    @Patch('/restore/:id')
    @ApiOperation({
        description: 'Recupera un producto borrado',
    })
    @ApiParam({
        name: 'id',
        description: 'id del producto',
        required: true,
        type: Number
    })
    @ApiResponse({
        status: 200,
        description: 'Se ha restaurado correctamente',
    })
    @ApiResponse({
        status: 409,
        description: `El producto no existe. <br />
        El producto no esta borrado. <br />`
    })
    restoreProduct(@Param('id') id:number){
        return this.ProductService.restoreProduct(id);
    }

    @Patch('/stock')
    @ApiOperation({
        description: 'Actualiza el stock de un producto',
    })
    @ApiBody({
        description: 'Actualiza el stock de un producto mediante un StockDto',
        type: StockDto,
        examples:{
            ejemplo1:{
                value:{
                    "id": 1,
                    "stock": 100,
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Se ha actualizado el stock correctamente',
    })
    @ApiResponse({
        status: 409,
        description: `El producto no existe. <br />
        El producto esta ya borrado. <br />`
    })
    updateStock(@Body() stock: StockDto){
        return this.ProductService.updateStock(stock);
    }

    @Patch('/increment-stock')
    @ApiOperation({
        description: 'Incremente el stock de un producto',
    })
    @ApiBody({
        description: 'Incrementa el stock de un producto mediante un StockDto, en el caso de superar 1000 de stock, este lo limita a 1000',
        type: StockDto,
        examples:{
            ejemplo1:{
                value:{
                    "id": 1,
                    "stock": 100,
                }
            },
            ejemplo2:{
                value:{
                    "id": 1,
                    "stock": 999,
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Se ha incrementado el stock correctamente',
    })
    @ApiResponse({
        status: 409,
        description: `El producto no existe. <br />
        El producto esta ya borrado. <br />`
    })
    incrementStock(@Body() stock: StockDto){
        return this.ProductService.incrementStock(stock);
    }

    @Patch('/decrement-stock')
    @ApiOperation({
        description: 'Decrementa el stock de un producto',
    })
    @ApiBody({
        description: 'Decrementa el stock de un producto mediante un StockDto, en el caso de que sea inferior a 0 de stock, este lo limita a 0',
        type: StockDto,
        examples:{
            ejemplo1:{
                value:{
                    "id": 1,
                    "stock": 100,
                }
            },
            ejemplo2:{
                value:{
                    "id": 1,
                    "stock": 999,
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Se ha decrementado correctamente',
    })
    @ApiResponse({
        status: 409,
        description: `El producto no existe. <br />
        El producto esta ya borrado. <br />`
    })
    decrementStock(@Body() stock: StockDto){
        return this.ProductService.decrementStock(stock);
    }

}
