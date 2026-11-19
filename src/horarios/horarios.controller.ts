import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { HorariosService } from './horarios.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('horarios')
@UseGuards(JwtAuthGuard)
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  crear(@Body() body: any, @Req() req: any) {
    return this.horariosService.crear(body, req.user.userId);
  }

  @Get('mios')
  obtenerMios(@Req() req: any) {
    return this.horariosService.obtenerPorProfesor(req.user.userId);
  }
}
