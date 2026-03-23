import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURACIÓN DE CORS 🌐
  // Permite que aplicaciones externas (como tu React en Vite) consuman la API
  app.enableCors({
    origin: '*', // En producción, aquí pondrías la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. PREFIJO GLOBAL DE LA API 📂
  // Todas tus rutas ahora serán: http://localhost:3000/api/...
  app.setGlobalPrefix('api');

  // 3. ACTIVAR VALIDACIÓN GLOBAL 🛡️ (Premisa 2)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían datos extra
      transform: true, // Transforma tipos automáticamente (ej: string a number)
    }),
  );

  // 4. DOCUMENTACIÓN SWAGGER 📝 (Premisa 5)
  const config = new DocumentBuilder()
    .setTitle('Alliance API')
    .setDescription(
      'Red social para profesionales de ingeniería - Pontificia Universidad Javeriana Cali',
    )
    .setVersion('1.0')
    .addBearerAuth() // Habilita el candadito para el JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 5. INICIO DEL SERVIDOR
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Alliance Backend corriendo en: http://localhost:${port}/api`);
  console.log(
    `📖 Documentación disponible en: http://localhost:${port}/api/docs`,
  );
}

bootstrap();
