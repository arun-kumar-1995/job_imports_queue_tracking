import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    api_url: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const APILists = model("APIList", schema);
