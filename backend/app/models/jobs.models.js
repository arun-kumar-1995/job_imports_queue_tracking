import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    job_id: {
      type: Number,
      required: true,
    },
    link: {
      type: String,
      trim: true,
      required: true,
    },
    published_date: {
      type: Date,
    },
    job_listing: {
      location: { type: String, trim: true },
      job_type: { type: String, trim: true },
      company: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export const Jobs = model("Job", schema);
