// C:\Users\vivek_laxvnt1\Desktop\nest-js-link-shrink\src\auth\auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async signUp(signupDto: SignUpDto): Promise<{ token: string }> {
        const { username, email, password } = signupDto
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = this.jwtService.sign({ id: user._id })
        return { token }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto
        
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid Password')
        }

        const token = this.jwtService.sign({ id: user._id })
        return { token }
    }
}
