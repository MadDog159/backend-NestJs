/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { ClientModule } from './modules/client/client.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "12345",
      "database": "shop",
      "entities": ["dist/**/*.entity{.ts,.js}"],
      "synchronize": true
    }),
    ProductModule,
    ClientModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
