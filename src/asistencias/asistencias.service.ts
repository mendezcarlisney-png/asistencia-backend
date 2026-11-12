import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsistenciaSesion } from './entities/asistencia-sesion.entity.js';
import { AsistenciaDetalle } from './entities/asistencia-detalle.entity.js';
import { Materia } from '../materias/entities/materia.entity.js';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(AsistenciaSesion)
    private readonly sesionRepo: Repository<AsistenciaSesion>,
    @InjectRepository(AsistenciaDetalle)
    private readonly detalleRepo: Repository<AsistenciaDetalle>,
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
  ) {}

  async create(dto: CreateAsistenciaDto, profesorId: string, rol: string) {
    const materia = await this.materiaRepo.findOne({
      where: { id: dto.materiaId },
    });
    if (!materia) throw new NotFoundException('Materia no encontrada');

    if (rol !== UserRole.ADMIN && materia.profesorId !== profesorId) {
      throw new ForbiddenException('No puedes registrar asistencia en esta materia');
    }

    const sesion = this.sesionRepo.create({
      materiaId: dto.materiaId,
      profesorId,
      fecha: new Date(dto.fecha),
      claseVista: dto.claseVista,
      detalles: dto.asistencias.map((a) =>
        this.detalleRepo.create({
          estudianteId: a.estudianteId,
          estado: a.estado,
        }),
      ),
    });

    const saved = await this.sesionRepo.save(sesion);

    return {
      message: 'Asistencia guardada correctamente',
      sesion: {
        id: saved.id,
        materia: materia.nombre,
        fecha: saved.fecha,
        claseVista: saved.claseVista,
        total: saved.detalles?.length ?? 0,
      },
    };
  }

  async findMisSesiones(profesorId: string) {
    return this.sesionRepo.find({
      where: { profesorId },
      order: { fecha: 'DESC' },
      relations: { materia: true, detalles: { estudiante: true } },
    });
  }
}
