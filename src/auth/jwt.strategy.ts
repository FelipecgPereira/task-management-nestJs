import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private configService: ConfigService,
        ){
            super({
                secretOrKey:configService.get('JWT_SECRET'),
                jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }

        async validate({username}: JwtPayload): Promise<User>{
            const user: User = await this.userRepository.findOneBy({username});
            if(!user){
                throw new UnauthorizedException();
            }
            return user;
        }
}