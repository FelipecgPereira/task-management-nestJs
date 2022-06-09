import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ControllerController } from './controller/controller.controller';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret:'topSecret!333',
      signOptions:{
        expiresIn: 3600,
      }
    })
    ,TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [ControllerController],
  exports:[JwtStrategy,PassportModule]
})
export class AuthModule {}
