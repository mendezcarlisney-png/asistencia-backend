import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateHorarioDto {
  @IsUUID('4', { message: 'materiaId debe ser un UUID valido' })
  materiaId: string;

  @IsString()
  @IsNotEmpty({ message: 'El dia es obligatorio' })
  dia: string;

  @Matches(HORA, { message: 'horaInicio debe tener formato HH:mm' })
  horaInicio: string;

  @Matches(HORA, { message: 'horaFin debe tener formato HH:mm' })
  horaFin: string;

  @IsOptional()
  @IsString()
  aula?: string;
}
