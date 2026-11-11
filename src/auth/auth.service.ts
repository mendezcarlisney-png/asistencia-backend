// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validar credenciales de usuario para el Login
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Generar el token de acceso JWT tras un login exitoso
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  // Registro de un nuevo usuario en el sistema
  async register(createUserDto: any) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      const { password, ...result } = newUser;
      return {
        message: 'Usuario registrado exitosamente',
        user: result,
      };
    } catch (error) {
      throw new ConflictException('El correo electrónico ya se encuentra registrado.');
    }
  }
}