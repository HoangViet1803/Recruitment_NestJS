import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from '../../permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;
@Schema({ timestamps: true })
export class Role {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: Permission[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  deleteBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
}

export const RoleSchema = SchemaFactory.createForClass(Role);
