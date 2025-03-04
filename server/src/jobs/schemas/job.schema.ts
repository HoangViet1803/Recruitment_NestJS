import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  })
  company: { _id: mongoose.Schema.Types.ObjectId; name: string };

  @Prop({ type: String, required: true })
  jobLocation: string;

  @Prop({ type: Number, required: true })
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
}

export const JobSchema = SchemaFactory.createForClass(Job);
