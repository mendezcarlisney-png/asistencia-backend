import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Materia } from '../../materias/entities/materia.entity.js';
import { AsistenciaDetalle } from './asistencia-detalle.entity.js';

@Entity('asistencia_sesiones')
export class AsistenciaSesion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  materiaId: string;

  @Column()
  profesorId: string;

  @Column({ type: 'timestamptz' })
  fecha: Date;

  @Column({ default: true })
  claseVista: boolean;

  @ManyToOne(() => Materia, { eager: true })
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'profesorId' })
  profesor: User;

  @OneToMany(() => AsistenciaDetalle, (detalle) => detalle.sesion, {
    cascade: true,
    eager: true,
  })
  detalles: AsistenciaDetalle[];

  @CreateDateColumn()
  createdAt: Date;
}
