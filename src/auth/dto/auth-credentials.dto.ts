import { IsString, MinLength, MaxLength, Matches, IsEmail } from "class-validator";

export class AuthCredentialsDto {
    @IsEmail({},{message: 'Debes proporcionar un email válido'})
    email: string;

    @IsString()
    @MinLength(6, {message: 'La contraseña debe contener 6 o más caracteres.'})
    @MaxLength(20, {message: 'La contraseña debe contener 20 caracteres o menos.'})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula y un dígito.'
    })
    password: string;
}