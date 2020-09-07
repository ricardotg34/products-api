import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/productsapp'),
    ProductsModule,
    MulterModule.register({
      dest: './static',
    }),
    AuthModule
  ],
})
export class AppModule {}
