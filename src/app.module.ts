import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { User } from './users/entities/user.entity.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Configuración de observabilidad por defecto de NestJS
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'asistencia-backend',
    }),
    
    // Configuración de la Base de Datos Relacional (PostgreSQL + TypeORM)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'tu_usuario_postgres', // Reemplaza con tu usuario local de PostgreSQL
      password: 'tu_password_postgres', // Reemplaza con tu contraseña local de PostgreSQL
      database: 'asistencia_db',
      entities: [User],
      synchronize: true, // Nota: Únicamente para entorno de desarrollo (crea las tablas automáticamente)
    }),

    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}