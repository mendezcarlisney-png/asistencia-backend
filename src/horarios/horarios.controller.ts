import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HorariosService } from './horarios.service.js';
import { CreateHorarioDto } from './dto/create-horario.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@Controller('horarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateHorarioDto) {
    return this.horariosService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('profesorId', new ParseUUIDPipe({ optional: true })) profesorId?: string) {
    return this.horariosService.findAll(profesorId);
  }

  @Get('mios')
  @Roles(UserRole.PROFESOR)
  findMios(@Req() req: any) {
    return this.horariosService.findMios(req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.horariosService.remove(id);
  }
}
