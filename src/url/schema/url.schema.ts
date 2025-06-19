// C:\Users\vivek_laxvnt1\Desktop\nest-js-link-shrink\src\url\schema\url.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ type: String, ref: 'User' })
  createdBy?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

}

export const UrlSchema = SchemaFactory.createForClass(Url);