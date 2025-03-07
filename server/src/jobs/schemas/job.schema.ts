import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: String })
  name: string;

  @Prop({ type: [String] })
  skills: string[];

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      logo: { type: String },
    },
  })
  company: { _id: mongoose.Schema.Types.ObjectId; name: string, logo: string };

  @Prop({ type: String })
  jobLocation: string;

  @Prop({ type: Number })
  salary: number;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: String })
  level: string;

  @Prop({ type: String })
  description: string; // HTML content stored as string

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Boolean })
  isActive: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Boolean })
  isDeleted: boolean;

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
    },
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
    },
  })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
    },
  })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Xử lý company
    if (ret.company) {
      delete ret.company.isDeleted;
      delete ret.company.deletedAt;
    }

    // Xử lý createdBy
    if (ret.createdBy) {
      delete ret.createdBy.isDeleted;
      delete ret.createdBy.deletedAt;
    }

    // Xử lý updatedBy
    if (ret.updatedBy) {
      delete ret.updatedBy.isDeleted;
      delete ret.updatedBy.deletedAt;
    }

    // Xử lý deletedBy
    if (ret.deletedBy) {
      delete ret.deletedBy.isDeleted;
      delete ret.deletedBy.deletedAt;
    }

    return ret;
  },
});

// Cũng áp dụng cho toObject
JobSchema.set('toObject', {
  transform: (doc, ret) => {
    // Xử lý company
    if (ret.company) {
      delete ret.company.isDeleted;
      delete ret.company.deletedAt;
    }

    // Xử lý createdBy
    if (ret.createdBy) {
      delete ret.createdBy.isDeleted;
      delete ret.createdBy.deletedAt;
    }

    // Xử lý updatedBy
    if (ret.updatedBy) {
      delete ret.updatedBy.isDeleted;
      delete ret.updatedBy.deletedAt;
    }

    // Xử lý deletedBy
    if (ret.deletedBy) {
      delete ret.deletedBy.isDeleted;
      delete ret.deletedBy.deletedAt;
    }

    return ret;
  },
});
