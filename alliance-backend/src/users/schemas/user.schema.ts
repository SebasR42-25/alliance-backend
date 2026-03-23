import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  location: string; // Ej: "Cali, Colombia"

  @Prop()
  bio: string;

  @Prop({ default: [] })
  skills: string[];

  @Prop()
  profilePicture: string;

  // NUEVO: Para el sistema de Networking
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  connections: Types.ObjectId[]; // Contactos ya aceptados

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  connectionRequests: Types.ObjectId[]; // Solicitudes pendientes
}

export const UserSchema = SchemaFactory.createForClass(User);
