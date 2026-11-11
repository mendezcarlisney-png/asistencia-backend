// src/users/users.service.ts
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
      // 1. Encriptar la contraseña de forma segura usando bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password!, salt);

      // 2. Crear la instancia de la entidad con la contraseña hasheada
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      // 3. Guardar en la base de datos PostgreSQL
      const savedUser = await this.userRepository.save(newUser);

      // 4. Creamos un nuevo objeto limpio excluyendo el password y casteando a User
      const { password, ...result } = savedUser as any;
      return result as User;

    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === '23505') {
        throw new ConflictException('El correo electrónico ya se encuentra registrado.');
      }
      throw new InternalServerErrorException('Error al crear el usuario en la base de datos.');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, // Forzamos la inclusión del password ya que por defecto está en false
        nombre: true,
        rol: true,
        isActive: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}