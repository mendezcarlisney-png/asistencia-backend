import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from './entities/user.entity.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('rol') rol?: string) {
    return this.usersService.findAll(rol);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: any) {
    if (req.user.rol !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException('No puedes ver este usuario');
    }
    const user = await this.usersService.findById(id);
    if (!user) {
      return { message: 'Usuario no encontrado' };
    }
    const { password, ...result } = user as any;
    return result;
  }
}
