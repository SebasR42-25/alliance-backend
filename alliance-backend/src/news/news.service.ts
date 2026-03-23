import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// 1. Definimos las interfaces para que TypeScript sepa qué responde NewsAPI
export interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

@Injectable()
export class NewsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getTechNews(): Promise<NewsArticle[]> {
    const apiKey = this.configService.get<string>('NEWS_API_KEY');

    // Validación de seguridad por si olvidamos poner la Key en el .env
    if (!apiKey) {
      throw new InternalServerErrorException(
        'API Key de noticias no configurada en el servidor',
      );
    }

    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=es&apiKey=${apiKey}`;

    try {
      // 2. Le indicamos a Axios <NewsApiResponse> para que el tipado sea estricto
      const response = await firstValueFrom(
        this.httpService.get<NewsApiResponse>(url),
      );
      return response.data.articles;
    } catch (error) {
      // 3. Manejo de error estricto (ya no es "any")
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error desconocido al contactar NewsAPI';
      throw new InternalServerErrorException(
        `Error al obtener noticias: ${errorMessage}`,
      );
    }
  }
}
