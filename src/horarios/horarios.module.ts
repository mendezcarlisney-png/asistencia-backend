import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity.js';
import { Materia } from '../materias/entities/materia.entity.js';
import { HorariosController } from './horarios.controller.js';
import { HorariosService } from './horarios.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Horario, Materia])],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}
