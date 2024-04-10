import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(
    @Body() body: { originalUrl: string },
  ): Promise<{ url: string }> {
    const url = await this.urlService.shortenUrl(body.originalUrl);
    return { url };
  }

  @Get()
  async getAll(@Query('ids') ids: string): Promise<{ [x: string]: string }[]> {
    const idArray = ids.split(',');
    try {
      const allUrls = await this.urlService.getAllUrls(idArray);
      return allUrls;
    } catch (err) {
      throw new HttpException(
        'One or more url not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':id')
  async getOriginalUrl(@Param('id') id: string): Promise<{ url: string }> {
    const url = await this.urlService.getUrl(id);
    if (url) return { url };
    else throw new HttpException('Url not found', HttpStatus.NOT_FOUND);
  }
}
