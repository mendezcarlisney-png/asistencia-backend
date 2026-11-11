// src/users/users.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      return { message: 'Usuario no encontrado' };
    }
    // Omitimos la contraseña por seguridad al retornar el perfil
    const { password, ...result } = user as any;
    return result;
  }
}