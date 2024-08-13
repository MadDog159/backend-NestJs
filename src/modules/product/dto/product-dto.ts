/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class ProductDto{
    
    @ApiProperty({
        name: 'id',
        required: false,
        description: 'id del producto',
        type: Number
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    id?: number;

    @ApiProperty({
        name: 'name',
        required: true,
        description: 'nombre del producto',
        type: String
    })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({
        name: 'price',
        required: true,
        description: 'precio del producto',
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price!: number;

    @ApiProperty({
        name: 'stock',
        required: true,
        description: 'stock del producto',
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    stock!: number;

    @ApiProperty({
        name: 'deleted',
        required: false,
        description: 'indica si el producto esta borrado',
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    deleted?: boolean;

}