import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

export enum EstadoAsistencia {
  PRESENTE = 'PRESENTE',
  AUSENTE = 'AUSENTE',
}

@Entity('asistencia_detalles')
export class AsistenciaDetalle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sesionId: string;

  @Column()
  estudianteId: string;

  @Column({
    type: 'enum',
    enum: EstadoAsistencia,
  })
  estado: EstadoAsistencia;

  @ManyToOne('AsistenciaSesion', 'detalles', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sesionId' })
  sesion: any;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;
}
