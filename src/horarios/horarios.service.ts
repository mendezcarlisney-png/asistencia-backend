import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './entities/horario.entity.js';
import { Materia } from '../materias/entities/materia.entity.js';
import { CreateHorarioDto } from './dto/create-horario.dto.js';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepo: Repository<Horario>,
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
  ) {}

  async create(dto: CreateHorarioDto) {
    const materia = await this.materiaRepo.findOne({ where: { id: dto.materiaId } });
    if (!materia) throw new NotFoundException('Materia no encontrada');

    const dia = dto.dia
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
    if (!DIAS.includes(dia)) throw new BadRequestException('Dia no valido');
    if (dto.horaInicio >= dto.horaFin) {
      throw new BadRequestException('La hora de fin debe ser mayor a la de inicio');
    }

    const delProfesor = await this.horarioRepo
      .createQueryBuilder('h')
      .innerJoin('h.materia', 'm')
      .where('m.profesorId = :p', { p: materia.profesorId })
      .andWhere('h.dia = :d', { d: dia })
      .getMany();
    const choque = delProfesor.some(
      (h) => dto.horaInicio < h.horaFin && dto.horaFin > h.horaInicio,
    );
    if (choque) {
      throw new ConflictException('El profesor ya tiene un bloque que se cruza con ese horario');
    }

    const horario = this.horarioRepo.create({
      materiaId: dto.materiaId,
      dia,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      aula: dto.aula,
    });
    const saved = await this.horarioRepo.save(horario);
    return this.horarioRepo.findOne({ where: { id: saved.id } });
  }

  private ordenar(lista: Horario[]) {
    return lista.sort(
      (a, b) =>
        DIAS.indexOf(a.dia) - DIAS.indexOf(b.dia) ||
        a.horaInicio.localeCompare(b.horaInicio),
    );
  }

  private base() {
    return this.horarioRepo
      .createQueryBuilder('h')
      .innerJoinAndSelect('h.materia', 'm')
      .innerJoinAndSelect('m.profesor', 'p');
  }

  async findAll(profesorId?: string) {
    const qb = this.base();
    if (profesorId) qb.where('m.profesorId = :profesorId', { profesorId });
    return this.ordenar(await qb.getMany());
  }

  async findMios(userId: string) {
    const qb = this.base().where('m.profesorId = :userId', { userId });
    return this.ordenar(await qb.getMany());
  }

  async remove(id: string) {
    const h = await this.horarioRepo.findOne({ where: { id } });
    if (!h) throw new NotFoundException('Horario no encontrado');
    await this.horarioRepo.delete(id);
    return { message: 'Horario eliminado correctamente' };
  }
}
