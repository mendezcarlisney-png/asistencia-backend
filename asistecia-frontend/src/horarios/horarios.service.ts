import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './entities/horario.entity.js';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private horarioRepo: Repository<Horario>,
  ) {}

  async crear(horarioData: any, profesorId: string) {
    const nuevo = this.horarioRepo.create({ ...horarioData, profesorId });
    return this.horarioRepo.save(nuevo);
  }

  async obtenerPorProfesor(profesorId: string) {
    return this.horarioRepo.find({ where: { profesorId } });
  }
}
