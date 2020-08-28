import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/Product.schema';
import { Model } from 'mongoose';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>){}

    async getAllProducts(): Promise<Product[]>{
        return await this.productModel.find().exec();
    }

    async getProductById(id: string): Promise<Product>{
        try {
            const product: Product = await this.productModel.findById(id).exec();
            if(!product){
                throw new NotFoundException(`El producto con id: ${id} no se encontró.`);
            }
            return product;
        } catch (error) {
            if(!(error instanceof NotFoundException))
                throw new InternalServerErrorException(`El id: ${id} no es válido.`);
            else throw error;
        }
    }

    async createProduct(createProductDTO: CreateProductDTO): Promise<Product>{
        const product = new this.productModel(createProductDTO);
        try {
            return await product.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async updateProduct(updateProductDTO: UpdateProductDTO, id: string): Promise<Product>{
        try {
            console.log(updateProductDTO);
            const product = await this.productModel.findByIdAndUpdate(id, updateProductDTO, {new: true}).exec();
            if(!product){
                throw new NotFoundException(`El producto con id: ${id} no se encontró.`);
            }
            return product;
        } catch (error) {
            if(!(error instanceof NotFoundException))
                throw new InternalServerErrorException(`El id: ${id} no es válido.`);
            else throw error;
        }
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await this.getProductById(id);
        try {
            await product.remove();
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
