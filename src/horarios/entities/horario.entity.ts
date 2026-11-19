import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Materia } from '../../materias/entities/materia.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('horarios_nuevos')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dia: string;

  @Column({ nullable: true })
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column({ nullable: true })
  aula: string;

  @ManyToOne(() => Materia, { eager: true })
  @JoinColumn({ name: 'materiaId' })
  materia: Materia;

  @Column()
  materiaId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'profesorId' })
  profesor: User;

  @Column()
  profesorId: string;
}
