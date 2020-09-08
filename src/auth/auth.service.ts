import { Injectable, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { User } from './schemas/User.schema';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) { }

  async signUp({ email, password }: AuthCredentialsDto): Promise<void> {
    const salt = bcrypt.genSaltSync();
    try {
      await this.userModel.create({
        email,
        password: bcrypt.hashSync(password, salt),
        salt
      })
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictException(['El usuario ya existe.']);
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword({ email, password }: AuthCredentialsDto): Promise<{ accessToken: string }> {
    try {
      const user: User = await this.userModel.findOne({ email });
      if (user && bcrypt.hashSync(password, user.salt) === user.password) {
        const payload = { email: user.email };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
      }
      else {
        throw new BadRequestException('El email o la contraseña no es válido.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      else throw new InternalServerErrorException('Error en el servidor.');
    }
  }

}
