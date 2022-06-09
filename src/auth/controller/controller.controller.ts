import { AuthCredentialsDto } from './../dto/auth-credentials.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Controller('auth')
export class ControllerController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('/singUp')
    singUp(@Body() authCredentialsDto:AuthCredentialsDto){
        return this.authService.singUp(authCredentialsDto)
    }

    @Post('/singIn')
    singIn(@Body() authCredentialsDto:AuthCredentialsDto): Promise<{accessToken: string}>{
       return  this.authService.singIn(authCredentialsDto)
    }
}
