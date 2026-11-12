import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service.js';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('asistencias')
@UseGuards(JwtAuthGuard)
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post()
  create(@Body() dto: CreateAsistenciaDto, @Req() req: any) {
    return this.asistenciasService.create(
      dto,
      req.user.userId,
      req.user.rol,
    );
  }

  @Get()
  misSesiones(@Req() req: any) {
    return this.asistenciasService.findMisSesiones(req.user.userId);
  }
}
