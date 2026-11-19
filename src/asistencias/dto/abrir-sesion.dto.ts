import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AbrirSesionDto {
  @IsUUID('4')
  @IsNotEmpty()
  materiaId: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsBoolean()
  claseVista?: boolean;
}
