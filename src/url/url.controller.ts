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

        const userId = req.user._id.toString()
        return this.urlService.createShortUrl(createUrlDto, userId);
    }

    @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserUrls(@Req() req, @Res() res: Response): Promise<void> {
    const userId = req.user._id.toString();
    
    const urls = await this.urlService.getUserUrls(userId);
    res.status(200).json(urls);
  }

    @Get(':shortCode')
    async redirectToOriginal(@Param() getUrlDto: GetUrlDto, @Res() res:Response): Promise< void > {
        const originalUrl = await this.urlService.getOriginalUrl(getUrlDto.shortCode);
        res.redirect(originalUrl);
    }
}
