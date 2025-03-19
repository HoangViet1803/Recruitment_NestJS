import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
import { Job } from '../../jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  url: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        status: {
          type: String,
          enum: ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'],
          required: true,
        },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          email: { type: String, required: true },
        },
      },
    ],
    default: [],
  })
  history: {
    status: string;
    updatedAt: Date;
    updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
  }[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    type: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      email: { type: String, required: true },
    },
  })
  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      email: { type: String },
    },
  })
  updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      email: { type: String },
    },
  })
  deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
