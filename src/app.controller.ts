import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@UploadedFile() file : Express.Multer.File) {
    const imageUrl = await this.appService.uploadFile(file);
    return imageUrl;
  }
}
