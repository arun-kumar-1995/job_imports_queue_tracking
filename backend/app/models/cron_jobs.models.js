import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    cron_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    scheduled_at: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CronJobs = model("cron_job", schema);
