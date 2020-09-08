import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/User.schema";
import { Model } from "mongoose";


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topsecret345'
    })
  }

  async validate(payload: {email: string}): Promise<User>{
    const {email} = payload;
    const user = await this.userModel.findOne({ email });
    if(!user){
      throw new UnauthorizedException();
    }
    return user;
  }
}