import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la materia es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString()
  grupo?: string;

  @IsOptional()
  @IsUUID('4', { message: 'profesorId debe ser un UUID valido' })
  profesorId?: string;
}
