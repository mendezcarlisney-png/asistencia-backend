import { IsEmail, IsNotEmpty, IsUUID, ValidateIf } from 'class-validator';

export class InscribirEstudianteDto {
  @ValidateIf((o) => !o.email)
  @IsUUID('4', { message: 'estudianteId debe ser un UUID válido' })
  estudianteId?: string;

  @ValidateIf((o) => !o.estudianteId)
  @IsEmail({}, { message: 'email no válido' })
  @IsNotEmpty()
  email?: string;
}
