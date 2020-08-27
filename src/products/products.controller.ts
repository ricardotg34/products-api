import { Controller, Get, Param, Post, Body, UsePipes, ValidationPipe, Delete, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/Product.schema';
import { CreateProductDTO } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService){}

    @Get()
    async getProducts(): Promise<Product[]>{
        return await this.productsService.getAllProducts();
    }

    @Get('/:id')
    async getProductById(@Param('id') id: string): Promise<Product> {
        return await this.productsService.getProductById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createProduct(
        @Body() createProductDTO: CreateProductDTO
    ): Promise<Product>{
        return await this.productsService.createProduct(createProductDTO);
    }

    @Delete('/:id')
    @HttpCode(204)
    async deleteProdcut(
        @Param('id') id: string
    ): Promise<void> {
        await this.productsService.deleteProduct(id);
    }

}
