import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password!, salt);

      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);

      const { password, ...result } = savedUser as any;
      return result as User;
    } catch (error: unknown) {
      console.error('ERROR REAL EN USERS SERVICE:', error);

      const err = error as { code?: string };
      if (err.code === '23505') {
        throw new ConflictException('El correo electronico ya se encuentra registrado.');
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
        password: true,
        nombre: true,
        rol: true,
        isActive: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll(rol?: string): Promise<User[]> {
    const rolValido = !!rol && (Object.values(UserRole) as string[]).includes(rol);
    return this.userRepository.find({
      where: rolValido ? { rol: rol as UserRole } : {},
      order: { nombre: 'ASC' },
    });
  }
}
