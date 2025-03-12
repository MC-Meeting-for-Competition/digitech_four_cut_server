import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from "fs";
import multer from 'multer';
import { v4 as uuid } from "uuid";

@Injectable()
export class AppService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = uuid();

    const { data, error } = await this.supabase.storage
      .from('photos') // 업로드할 스토리지 버킷 이름
      .upload(`images/${fileName}_${file.originalname}`, file.buffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }


    const { data: publicUrlData } = this.supabase.storage
      .from("photos")
      .getPublicUrl(`images/${fileName}_${file.originalname}`);


    return `https://mc-meeting-for-competition.github.io/digitech_film_web/?image_url=${publicUrlData.publicUrl}`;
  }
}
