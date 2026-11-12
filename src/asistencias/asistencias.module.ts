import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciasService } from './asistencias.service.js';
import { AsistenciasController } from './asistencias.controller.js';
import { AsistenciaSesion } from './entities/asistencia-sesion.entity.js';
import { AsistenciaDetalle } from './entities/asistencia-detalle.entity.js';
import { Materia } from '../materias/entities/materia.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AsistenciaSesion, AsistenciaDetalle, Materia]),
  ],
  controllers: [AsistenciasController],
  providers: [AsistenciasService],
})
export class AsistenciasModule {}
