import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module'; // 1. Importar el módulo

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule, // 2. Agregar a los imports
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos para que AuthModule y otros puedan usarlo
})
export class UsersModule {}
