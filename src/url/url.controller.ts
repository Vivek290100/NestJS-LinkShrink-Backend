// C:\Users\vivek_laxvnt1\Desktop\nest-js-link-shrink\src\url\url.controller.ts
import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './schema/url.schema';
import { GetUrlDto } from './dto/get-url.dto';
import { Response } from 'express';

@Controller('url')
export class UrlController {
    constructor(
        private urlService: UrlService,
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createShortUrl(@Body() createUrlDto: CreateUrlDto, @Req() req,): Promise<Url> {
        console.log("pppppppp", req.user);

        const userId = req.user
        return this.urlService.createShortUrl(createUrlDto, userId);
    }

    @Get(':shortCode')
    async redirectToOriginal(@Param() getUrlDto: GetUrlDto, @Res() res:Response): Promise< void > {
        const originalUrl = await this.urlService.getOriginalUrl(getUrlDto.shortCode);
        res.redirect(originalUrl);
    }
}
