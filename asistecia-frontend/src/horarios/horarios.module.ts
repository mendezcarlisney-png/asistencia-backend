import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity.js';
import { HorariosService } from './horarios.service.js';
import { HorariosController } from './horarios.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Horario])],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}
