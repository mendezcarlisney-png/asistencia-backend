// src/auth/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Opcional: Puedes definir un enum en TypeScript para mayor seguridad de tipos
export enum RolEnum {
  ADMIN = 'ADMIN',
  PROFESOR = 'PROFESOR',
  ESTUDIANTE = 'ESTUDIANTE',
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsEnum(RolEnum, { message: 'Rol no válido. Debe ser ADMIN, PROFESOR o ESTUDIANTE' })
  rol: RolEnum;
}