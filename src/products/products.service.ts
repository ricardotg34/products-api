import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/Product.schema';
import { Model } from 'mongoose';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import * as fs from 'fs';
import { join } from 'path';

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
            this.deleteFile(product.imagePath);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async setImagePath(path: string, id: string): Promise<Product>{
        console.log(path);
        try {
            const product = await this.productModel.findById(id, {imagePath: path}).exec();
            if(!product){
                throw new NotFoundException(`El producto con id: ${id} no se encontró.`);
            }
            this.deleteFile(product.imagePath);
            return await product.set({imagePath: path}).save();
        } catch (error) {
            this.deleteFile(path);
            if(!(error instanceof NotFoundException))
                throw new InternalServerErrorException(`El id: ${id} no es válido.`);
            else throw error;
        }
    }

    deleteFile(imagePath: string): void {
        try {
            const completePath = join('./static', imagePath);
            if(fs.existsSync(completePath)){
                fs.unlinkSync(completePath);
            }
        } catch (error) {
            console.log('Image path undefined')
        }
      }
}
