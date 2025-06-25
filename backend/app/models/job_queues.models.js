import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    api_id: {
      type: Schema.Types.ObjectId,
      ref: "APIList",
      required: true,
    },
    job_id: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "completed"],
    },
  },
  { timestamps: true }
);

/** define index **/
schema.index({ job_id: 1 });

/**import model **/
export const JobQueues = model("job_queue", schema);
