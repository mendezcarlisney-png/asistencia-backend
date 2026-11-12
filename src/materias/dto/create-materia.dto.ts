import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la materia es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString()
  grupo?: string;
}
