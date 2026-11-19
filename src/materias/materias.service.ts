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
import { AsistenciaSesion } from '../asistencias/entities/asistencia-sesion.entity.js';
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

  async create(dto: CreateMateriaDto, userId: string, rol: string): Promise<Materia> {
    let profesorId = userId;

    if (rol === UserRole.ADMIN) {
      if (!dto.profesorId) {
        throw new BadRequestException('Debes indicar el profesorId');
      }
      const profesor = await this.userRepo.findOne({ where: { id: dto.profesorId } });
      if (!profesor || profesor.rol !== UserRole.PROFESOR) {
        throw new BadRequestException('El profesorId no corresponde a un profesor');
      }
      profesorId = profesor.id;
    }

    const materia = this.materiaRepo.create({
      nombre: dto.nombre,
      grupo: dto.grupo,
      profesorId,
    });
    return this.materiaRepo.save(materia);
  }

  async findAll(): Promise<Materia[]> {
    return this.materiaRepo.find({ order: { nombre: 'ASC' } });
  }

  async findMisMaterias(userId: string, rol: string): Promise<Materia[]> {
    if (rol === UserRole.ESTUDIANTE) {
      const inscripciones = await this.inscripcionRepo.find({
        where: { estudianteId: userId },
        relations: { materia: true },
      });
      return inscripciones
        .map((i) => i.materia)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return this.materiaRepo.find({
      where: { profesorId: userId },
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

    const esAutoinscripcion = rol === UserRole.ESTUDIANTE;

    if (!esAutoinscripcion && rol !== UserRole.ADMIN && materia.profesorId !== userId) {
      throw new ForbiddenException('No puedes inscribir en esta materia');
    }

    let estudiante: User | null = null;

    if (esAutoinscripcion) {
      estudiante = await this.userRepo.findOne({ where: { id: userId } });
    } else if (dto.estudianteId) {
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
    if (existe) throw new ConflictException('El estudiante ya esta inscrito');

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

  async remove(id: string) {
    const materia = await this.materiaRepo.findOne({ where: { id } });
    if (!materia) throw new NotFoundException('Materia no encontrada');

    await this.materiaRepo.manager.transaction(async (manager) => {
      await manager.delete(AsistenciaSesion, { materiaId: id });
      await manager.delete(Inscripcion, { materiaId: id });
      await manager.delete(Materia, { id });
    });

    return { message: 'Materia eliminada correctamente' };
  }

  async findDisponibles(estudianteId: string): Promise<Materia[]> {
    return this.materiaRepo
      .createQueryBuilder('m')
      .leftJoin('m.profesor', 'p')
      .addSelect(['p.id', 'p.nombre'])
      .where((qb) => {
        const sub = qb
          .subQuery()
          .select('i.materiaId')
          .from(Inscripcion, 'i')
          .where('i.estudianteId = :estudianteId')
          .getQuery();
        return 'm.id NOT IN ' + sub;
      })
      .setParameter('estudianteId', estudianteId)
      .orderBy('m.nombre', 'ASC')
      .getMany();
  }


  async findAllConEstudiantes() {
    const materias = await this.materiaRepo.find({ order: { nombre: 'ASC' } });
    const insc = await this.inscripcionRepo.find({ relations: { estudiante: true } });
    return materias.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      grupo: m.grupo,
      profesor: m.profesor?.nombre ?? null,
      estudiantes: insc
        .filter((i) => i.materiaId === m.id)
        .map((i) => ({ id: i.estudiante.id, nombre: i.estudiante.nombre, email: i.estudiante.email })),
    }));
  }

}
