import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { User, UserSchema } from '../users/schemas/user.schema'; // 1. Importa User
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module'; // 2. Importa Cloudinary

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema }, // 3. Registra el modelo de usuario
    ]),
    CloudinaryModule, // 4. Registra el módulo de Cloudinary
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
