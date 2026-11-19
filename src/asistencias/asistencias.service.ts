import { ForbiddenException as ForbiddenEx, NotFoundException as NotFoundEx } from '@nestjs/common';
import { Inscripcion } from '../materias/entities/inscripcion.entity.js';
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

  async findMisAsistencias(estudianteId: string) {
    const detalles = await this.detalleRepo
      .createQueryBuilder('d')
      .innerJoinAndSelect('d.sesion', 's')
      .innerJoinAndSelect('s.materia', 'm')
      .where('d.estudianteId = :estudianteId', { estudianteId })
      .orderBy('s.fecha', 'DESC')
      .getMany();

    return detalles.map((d) => ({
      id: d.id,
      fecha: d.sesion.fecha,
      claseVista: d.sesion.claseVista,
      estado: d.estado,
      materiaId: d.sesion.materiaId,
      materia: d.sesion.materia?.nombre,
    }));
  }

  async reporte(materiaId: string, userId: string, rol: string) {
    const materia = await this.materiaRepo.findOne({ where: { id: materiaId } });
    if (!materia) throw new NotFoundEx('Materia no encontrada');
    if (rol !== 'ADMIN' && materia.profesorId !== userId) throw new ForbiddenEx('No tienes acceso a esta materia');
    const sesiones = await this.sesionRepo.find({ where: { materiaId }, relations: { detalles: true } });
    const insc = await this.sesionRepo.manager.getRepository(Inscripcion).find({ where: { materiaId }, relations: { estudiante: true } });
    const total = sesiones.length;
    return insc.map((i) => {
      const presentes = sesiones.filter((s) => s.detalles.some((d) => d.estudianteId === i.estudianteId && String(d.estado) === 'PRESENTE')).length;
      const pct = total ? Math.round((presentes / total) * 1000) / 10 : 100;
      return {
        id: i.estudiante.id, nombre: i.estudiante.nombre, email: i.estudiante.email,
        materia: materia.nombre, totalClases: total, presentes, ausentes: total - presentes,
        porcentajeAsistencia: pct, enRiesgo: pct < 75,
      };
    });
  }

}
