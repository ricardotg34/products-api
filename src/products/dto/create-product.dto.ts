import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number
}