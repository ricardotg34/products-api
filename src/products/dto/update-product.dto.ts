import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProductDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsBoolean()
    available: boolean
}