import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() authDto: AuthDto) {
        return this.authService.register(authDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto);
    }
}
