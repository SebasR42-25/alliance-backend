import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Message } from './schemas/message.schema';
import { User } from '../users/schemas/user.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service'; // Inyectamos Cloudinary

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly cloudinaryService: CloudinaryService, // Nuevo
  ) {}

  async saveMessage(
    senderId: string,
    receiverId: string,
    content: string,
    file?: Express.Multer.File, // Soporte para adjuntos
  ): Promise<Message> {
    const senderObjId = new Types.ObjectId(senderId);
    const receiverObjId = new Types.ObjectId(receiverId);

    // 1. Manejo de archivo adjunto si existe
    let attachmentUrl: string | null = null;
    if (file) {
      const upload = await this.cloudinaryService.uploadFile(file);
      attachmentUrl = upload.secure_url;
    }

    // 2. Buscar o crear la conversación
    let conversation = await this.conversationModel.findOne({
      participants: { $all: [senderObjId, receiverObjId] },
    });

    if (!conversation) {
      conversation = new this.conversationModel({
        participants: [senderObjId, receiverObjId],
      });
      await conversation.save();
    }

    // 3. Crear y guardar el mensaje
    const newMessage = new this.messageModel({
      conversationId: conversation._id,
      sender: senderObjId,
      content,
      attachmentUrl, // Guardamos la URL de la imagen
    });
    const savedMessage = await newMessage.save();

    // 4. Actualizar la conversación (Último mensaje y fecha de actualización)
    await this.conversationModel.findByIdAndUpdate(conversation._id, {
      lastMessage: savedMessage._id,
      updatedAt: new Date(), // Forzamos el refresh para el orden del feed de chats
    });

    // 5. NOTIFICACIÓN EN TIEMPO REAL 💬
    const sender = await this.userModel.findById(senderId);

    // Si hay adjunto y no hay texto, enviamos un mensaje genérico
    const notificationText = content
      ? content.substring(0, 30)
      : '📷 Envió una imagen';

    this.notificationsGateway.sendNotification(receiverId, {
      type: 'NEW_CHAT_MESSAGE',
      message: `Mensaje de ${sender?.name}: "${notificationText}..."`,
      payload: {
        conversationId: conversation._id,
        senderName: sender?.name,
        attachmentUrl,
      },
    });

    return savedMessage;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel
      .find({ participants: new Types.ObjectId(userId) })
      .populate('participants', 'name profilePicture')
      .populate('lastMessage')
      .sort({ updatedAt: -1 }) // Las conversaciones más recientes primero
      .exec();
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .sort({ createdAt: 1 })
      .exec();

    if (!messages) throw new NotFoundException('No se encontraron mensajes');
    return messages;
  }
}
