import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Materia } from './materia.entity.js';

@Entity('inscripciones')
@Unique(['estudianteId', 'materiaId'])
export class Inscripcion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  estudianteId: string;

  @Column()
  materiaId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'estudianteId' })
  estudiante: User;

  @ManyToOne(() => Materia, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  @CreateDateColumn()
  createdAt: Date;
}
