import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Necesario para axios
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  imports: [HttpModule], // <-- Importante para que funcione el NewsService
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
