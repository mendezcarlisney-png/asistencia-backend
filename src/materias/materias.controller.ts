import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MateriasService } from './materias.service.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { InscribirEstudianteDto } from './dto/inscribir-estudiante.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('materias')
@UseGuards(JwtAuthGuard)
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Body() dto: CreateMateriaDto, @Req() req: any) {
    return this.materiasService.create(dto, req.user.userId);
  }

  @Get('mis-materias')
  misMaterias(@Req() req: any) {
    return this.materiasService.findMisMaterias(req.user.userId);
  }

  @Get(':id/estudiantes')
  estudiantes(@Param('id') id: string, @Req() req: any) {
    return this.materiasService.findEstudiantes(
      id,
      req.user.userId,
      req.user.rol,
    );
  }

  @Post(':id/inscribir')
  inscribir(
    @Param('id') id: string,
    @Body() dto: InscribirEstudianteDto,
    @Req() req: any,
  ) {
    return this.materiasService.inscribir(
      id,
      dto,
      req.user.userId,
      req.user.rol,
    );
  }
}
