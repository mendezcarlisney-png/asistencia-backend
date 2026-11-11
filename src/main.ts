// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activamos el pipe global de validación y transformación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en los DTOs
      forbidNonWhitelisted: true, // Rechaza la petición si envían campos extra no definidos
      transform: true, // Transforma los payloads a los tipos de los DTOs
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo exitosamente en: http://localhost:${port}`);
}
bootstrap();