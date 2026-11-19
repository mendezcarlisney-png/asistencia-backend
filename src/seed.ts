import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UsersService } from './users/users.service.js';
import { UserRole } from './users/entities/user.entity.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@test.com';
  const adminPassword = 'admin123';

  try {
    const existe = await usersService.findByEmail(adminEmail);
    if (existe) {
      console.log('✅ El administrador ya existe. Credenciales: admin@test.com / admin123');
    } else {
      await usersService.create({
        nombre: 'Administrador Test',
        email: adminEmail,
        password: adminPassword,
        rol: UserRole.ADMIN,
      });
      console.log('✅ Administrador creado con éxito.');
      console.log('📧 Correo: admin@test.com');
      console.log('🔑 Contraseña: admin123');
    }
  } catch (error) {
    console.error('❌ Error creando el usuario:', error);
  }
  await app.close();
}

bootstrap();
