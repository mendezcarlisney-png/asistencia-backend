import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export class InscribirEstudianteDto {
  @IsOptional()
  @IsUUID('4', { message: 'estudianteId debe ser un UUID valido' })
  estudianteId?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email no valido' })
  email?: string;
}
