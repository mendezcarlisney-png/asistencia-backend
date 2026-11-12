import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoAsistencia } from '../entities/asistencia-detalle.entity.js';

class AsistenciaItemDto {
  @IsUUID('4')
  estudianteId: string;

  @IsEnum(EstadoAsistencia, {
    message: 'estado debe ser PRESENTE o AUSENTE',
  })
  estado: EstadoAsistencia;
}

export class CreateAsistenciaDto {
  @IsUUID('4', { message: 'materiaId debe ser UUID' })
  @IsNotEmpty()
  materiaId: string;

  @IsDateString()
  fecha: string;

  @IsBoolean()
  claseVista: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsistenciaItemDto)
  asistencias: AsistenciaItemDto[];
}
