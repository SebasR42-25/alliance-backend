import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  // Los usuarios que participan en este chat (generalmente 2)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  // Referencia al último mensaje enviado para mostrarlo en la vista previa del chat
  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
