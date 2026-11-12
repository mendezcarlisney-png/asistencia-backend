import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './entities/materia.entity.js';
import { Inscripcion } from './entities/inscripcion.entity.js';
import { User, UserRole } from '../users/entities/user.entity.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { InscribirEstudianteDto } from './dto/inscribir-estudiante.dto.js';

@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateMateriaDto, profesorId: string): Promise<Materia> {
    const materia = this.materiaRepo.create({
      ...dto,
      profesorId,
    });
    return this.materiaRepo.save(materia);
  }

  async findMisMaterias(profesorId: string): Promise<Materia[]> {
    return this.materiaRepo.find({
      where: { profesorId },
      order: { nombre: 'ASC' },
    });
  }

  async findEstudiantes(materiaId: string, userId: string, rol: string) {
    const materia = await this.materiaRepo.findOne({ where: { id: materiaId } });
    if (!materia) throw new NotFoundException('Materia no encontrada');

    if (rol !== UserRole.ADMIN && materia.profesorId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta materia');
    }

    const inscripciones = await this.inscripcionRepo.find({
      where: { materiaId },
      relations: { estudiante: true },
    });

    return inscripciones.map((i) => ({
      id: i.estudiante.id,
      nombre: i.estudiante.nombre,
      email: i.estudiante.email,
    }));
  }

  async inscribir(
    materiaId: string,
    dto: InscribirEstudianteDto,
    userId: string,
    rol: string,
  ) {
    const materia = await this.materiaRepo.findOne({ where: { id: materiaId } });
    if (!materia) throw new NotFoundException('Materia no encontrada');

    if (rol !== UserRole.ADMIN && materia.profesorId !== userId) {
      throw new ForbiddenException('No puedes inscribir en esta materia');
    }

    let estudiante: User | null = null;

    if (dto.estudianteId) {
      estudiante = await this.userRepo.findOne({ where: { id: dto.estudianteId } });
    } else if (dto.email) {
      estudiante = await this.userRepo.findOne({ where: { email: dto.email } });
    } else {
      throw new BadRequestException('Debes enviar estudianteId o email');
    }

    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    if (estudiante.rol !== UserRole.ESTUDIANTE) {
      throw new BadRequestException('El usuario no es un estudiante');
    }

    const existe = await this.inscripcionRepo.findOne({
      where: { materiaId, estudianteId: estudiante.id },
    });
    if (existe) throw new ConflictException('El estudiante ya está inscrito');

    const inscripcion = this.inscripcionRepo.create({
      materiaId,
      estudianteId: estudiante.id,
    });
    await this.inscripcionRepo.save(inscripcion);

    return {
      message: 'Estudiante inscrito correctamente',
      estudiante: {
        id: estudiante.id,
        nombre: estudiante.nombre,
        email: estudiante.email,
      },
    };
  }
}
