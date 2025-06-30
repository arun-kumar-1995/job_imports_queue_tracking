import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    api_id: {
      type: Schema.Types.ObjectId,
      ref: "APIList",
      required: true,
      index: true,
    },
    job_id: {
      type: Number,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "completed"],
    },
  },
  { timestamps: true }
);

/**import model **/
export const JobQueues = model("job_queue", schema);
