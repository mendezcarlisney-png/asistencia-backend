import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriasService } from './materias.service.js';
import { MateriasController } from './materias.controller.js';
import { Materia } from './entities/materia.entity.js';
import { Inscripcion } from './entities/inscripcion.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Materia, Inscripcion, User])],
  controllers: [MateriasController],
  providers: [MateriasService],
  exports: [MateriasService, TypeOrmModule],
})
export class MateriasModule {}
