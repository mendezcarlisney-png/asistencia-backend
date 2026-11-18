import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service.js';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@Controller('asistencias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  create(@Body() dto: CreateAsistenciaDto, @Req() req: any) {
    return this.asistenciasService.create(dto, req.user.userId, req.user.rol);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  misSesiones(@Req() req: any) {
    return this.asistenciasService.findMisSesiones(req.user.userId);
  }

  @Get('estudiante')
  @Roles(UserRole.ESTUDIANTE)
  misAsistencias(@Req() req: any) {
    return this.asistenciasService.findMisAsistencias(req.user.userId);
  }
}
