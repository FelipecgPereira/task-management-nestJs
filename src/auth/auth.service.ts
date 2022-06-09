import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ){}

    async singUp({username, password}:AuthCredentialsDto):Promise<User> {
        const found = await this.userRepository.findOneBy({username});

        if(found){
            throw new ConflictException('Username already exists')
        }
        const hash = await bcrypt.hash(password,10);
        
        const user =  this.userRepository.create({username,password: hash});
        await this.userRepository.save(user);
        return user; 
    }

    async singIn({username, password}:AuthCredentialsDto):Promise<{accessToken: string}>{
        const user = await this.userRepository.findOneBy({username});


        if(user && (await bcrypt.compare(password, user.password))){
            const payload:JwtPayload = {username};
            const accessToken: string = await this.jwtService.sign(payload);
            return {accessToken};
        }else{
            throw new UnauthorizedException('Please check your login credentials')
        }
    }


   
}
