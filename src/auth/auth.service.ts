import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: any) {
    const nombre = createUserDto.nombre ?? createUserDto.name;
    if (!nombre || !String(nombre).trim()) {
      throw new ConflictException('El nombre es obligatorio');
    }

    const allowed = ['ESTUDIANTE', 'PROFESOR', 'ADMIN'];
    const rawRol = createUserDto.rol ?? createUserDto.role ?? 'ESTUDIANTE';
    const roleMap: Record<string, string> = { administrador: 'ADMIN', admin: 'ADMIN', profesor: 'PROFESOR', estudiante: 'ESTUDIANTE' };
    const mapped = roleMap[String(rawRol).trim().toLowerCase()] ?? String(rawRol).trim().toUpperCase();
    const rol = mapped as UserRole;
    if (!allowed.includes(rol)) {
      throw new ConflictException('Rol no valido. Use ESTUDIANTE, PROFESOR o ADMIN');
    }

    const payload = {
      nombre: String(nombre).trim(),
      email: createUserDto.email,
      password: createUserDto.password,
      rol,
    };

    try {
      const newUser = await this.usersService.create(payload);
      const { password, ...result } = newUser;
      return {
        message: 'Usuario registrado exitosamente',
        user: result,
      };
    } catch (error: any) {
      if (error && error.code === '23505') {
        throw new ConflictException('El correo electronico ya se encuentra registrado.');
      }
      console.error('Error desconocido en registro:', error);
      throw error;
    }
  }
}
