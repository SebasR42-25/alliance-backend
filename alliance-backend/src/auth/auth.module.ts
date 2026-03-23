import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy'; // <-- Importamos nuestra estrategia

@Module({
  imports: [
    UsersModule,
    // Configuramos el JwtModule para que lea nuestro secreto desde el .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // El token expirará en 1 día
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- Añadimos el JwtStrategy a los proveedores
})
export class AuthModule {}
