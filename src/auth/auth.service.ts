import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { User } from './schemas/User.schema';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
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

}
