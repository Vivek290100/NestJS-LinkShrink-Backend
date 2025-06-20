import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './schema/url.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
    constructor(
        @InjectModel(Url.name)
        private urlModel: Model<Url>
    ) { } 

    private _generateShortCode(length = 6): string {
        return randomBytes(length)
            .toString('base64')
            .slice(0, length)
            .replace(/[^a-zA-Z0-9]/g, '');
    }

    async createShortUrl(createUrlDto: CreateUrlDto, userId: string): Promise<Url> {
        let shortCode: string = ''
        let isUnique = false

        while (!isUnique) {
            shortCode = this._generateShortCode()
            const existingUrl = await this.urlModel.findOne({ shortCode })
            if (!existingUrl) isUnique = true
        }

        const url = new this.urlModel({
            originalUrl: createUrlDto.originalUrl,
            shortCode,
            createdBy: userId
        })
        const savedUrl = await url.save();
        return savedUrl.save()
    }

    async getUserUrls(userId: string): Promise<Url[]> {
    const urls = await this.urlModel
      .find({ createdBy: userId })
      .sort({ createdAt: -1 }) 
      .limit(1)
      .exec();
    
    if (!urls.length) {
      throw new NotFoundException('No links found. Try shortening your first URL!');
    }
    return urls;
  }

    async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) {
      throw new Error('Short URL not found');
    }

    return url.originalUrl;
  }
}
