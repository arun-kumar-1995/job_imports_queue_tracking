import mongoose, { Schema, model } from "mongoose";
const schema = new Schema(
  {
    api_id: {
      type: Schema.Types.ObjectId,
      ref: "APIList",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "completed"],
    },
  },
  { timestamps: true }
);

export const Queues = model("Queues", schema);
