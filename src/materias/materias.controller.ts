import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MateriasService } from './materias.service.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { InscribirEstudianteDto } from './dto/inscribir-estudiante.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

const materiaIdPipe = new ParseUUIDPipe({
  exceptionFactory: () =>
    new BadRequestException('El codigo de la materia no es valido'),
});

@Controller('materias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  create(@Body() dto: CreateMateriaDto, @Req() req: any) {
    return this.materiasService.create(dto, req.user.userId, req.user.rol);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.materiasService.findAll();
  }

  @Get('mis-materias')
  misMaterias(@Req() req: any) {
    return this.materiasService.findMisMaterias(req.user.userId, req.user.rol);
  }

  @Get(':id/estudiantes')
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  estudiantes(@Param('id', materiaIdPipe) id: string, @Req() req: any) {
    return this.materiasService.findEstudiantes(id, req.user.userId, req.user.rol);
  }

  @Post(':id/inscribir')
  inscribir(
    @Param('id', materiaIdPipe) id: string,
    @Body() dto: InscribirEstudianteDto,
    @Req() req: any,
  ) {
    return this.materiasService.inscribir(id, dto, req.user.userId, req.user.rol);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', materiaIdPipe) id: string) {
    return this.materiasService.remove(id);
  }
}
