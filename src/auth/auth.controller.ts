import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signUp')
    async signUp(@Body(ValidationPipe) authCredentialsDto :AuthCredentialsDto): Promise<void>{
        await this.authService.signUp(authCredentialsDto);
    }

    @Post('signIn')
    async signIn(@Body(ValidationPipe) authCredentialsDto :AuthCredentialsDto): Promise<{accessToken: string}>{
        return await this.authService.validateUserPassword(authCredentialsDto);
    }
}
