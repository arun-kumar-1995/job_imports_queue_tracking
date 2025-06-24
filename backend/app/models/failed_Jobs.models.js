import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    api_id: {
      type: Schema.Types.ObjectId,
      ref: "APIList",
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: "Jobs",
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const FailedJobs = model("FailedJobs", schema);
