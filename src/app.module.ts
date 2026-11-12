import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MateriasModule } from './materias/materias.module.js';
import { AsistenciasModule } from './asistencias/asistencias.module.js';
import { User } from './users/entities/user.entity.js';
import { Materia } from './materias/entities/materia.entity.js';
import { Inscripcion } from './materias/entities/inscripcion.entity.js';
import { AsistenciaSesion } from './asistencias/entities/asistencia-sesion.entity.js';
import { AsistenciaDetalle } from './asistencias/entities/asistencia-detalle.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Materia, Inscripcion, AsistenciaSesion, AsistenciaDetalle],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
    UsersModule,
    AuthModule,
    MateriasModule,
    AsistenciasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
