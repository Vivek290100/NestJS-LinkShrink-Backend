import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('health')
    @UseGuards(AuthGuard('jwt'))
    check(@Res() res: Response) {
        res.sendStatus(200);
    }

    @Post('/signup')
    async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response): Promise<void> {

        await this.authService.signUp(signUpDto, res);
        res.sendStatus(201);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
        await this.authService.login(loginDto, res);
        res.sendStatus(200);
    }

    @Post('/logout')
    async logout(@Res() res: Response): Promise<void> {
        await this.authService.logout(res);
        res.sendStatus(200);
    }
}