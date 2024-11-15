import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Token } from '../types/token.types';
import { BaseDocument } from 'microservice-app-library';

@Schema()
export class User extends BaseDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  token: Token;
}

export const UserSchema = SchemaFactory.createForClass(User);
