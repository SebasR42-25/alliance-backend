import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  company: Types.ObjectId;

  @Prop({ required: true })
  location: string;

  @Prop()
  salaryRange: string;

  @Prop()
  description: string;

  @Prop({ default: [] })
  tags: string[];

  // NUEVO: Lista de usuarios que se han postulado
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  applicants: Types.ObjectId[];

  // NUEVO: Lista de usuarios que han guardado la oferta (Bookmark)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  savedBy: Types.ObjectId[];
}

export const JobSchema = SchemaFactory.createForClass(Job);
