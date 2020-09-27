import { Controller, Get, Param, Post, Body, UsePipes, ValidationPipe, Delete, HttpCode, Put, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/Product.schema';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Get()
  @UseGuards(AuthGuard())
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getAllProducts();
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async createProduct(
    @Body() createProductDTO: CreateProductDTO
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDTO);
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDTO: UpdateProductDTO
  ): Promise<Product> {
    return await this.productsService.updateProduct(updateProductDTO, id);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard())
  async deleteProdcut(
    @Param('id') id: string
  ): Promise<void> {
    await this.productsService.deleteProduct(id);
  }

  @Post('/setImage/:id')
  @UseInterceptors(FileInterceptor(
    'file',
    {
      storage: diskStorage({
        destination: './static',
        filename: (req, file, cb) => {
          const fileSplit = file.originalname.split('.');
          cb(null, `${fileSplit[0]}-${new Date().getMilliseconds()}.${fileSplit[1]}`);
        },
      }),
    }
  ))
  @UseGuards(AuthGuard())
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async uploadedFile(@UploadedFile() file, @Param('id') id: string): Promise<Product> {
    console.log(file);
    return await this.productsService.setImagePath(file.filename, id) ;
  }

  @Get('images/:imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res: Response): void {
    res.sendFile(image, { root: './static' });
  }

}
