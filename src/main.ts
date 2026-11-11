// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js'; // <-- Solo importamos AppModule

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Opcional: prefijo global para tus rutas de API si lo deseas (ej. /api)
  // app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo exitosamente en: http://localhost:3000`);
}
bootstrap();