import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  apiPath: string;

  @Prop({ type: String, required: true })
  method: string;

  @Prop({ type: String, required: true })
  module: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      email: { type: String },
    },
    default: null,
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      email: { type: String },
    },
    default: null,
  })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      email: { type: String },
    },
    default: null,
  })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);
