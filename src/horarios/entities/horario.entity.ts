import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Materia } from '../../materias/entities/materia.entity.js';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  materiaId: string;

  @Column()
  dia: string;

  @Column({ length: 5 })
  horaInicio: string;

  @Column({ length: 5 })
  horaFin: string;

  @Column({ nullable: true })
  aula: string;

  @ManyToOne(() => Materia, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  @CreateDateColumn()
  createdAt: Date;
}
