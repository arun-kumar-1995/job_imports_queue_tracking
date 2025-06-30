import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    import_date: {
      type: Date,
    },
    file_name: {
      type: String,
      required: true,
    },
    api_id: {
      type: Schema.Types.ObjectId,
      ref: "APIList",
      required: true,
      index: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    new: {
      type: Number,
      default: 0,
    },
    updated: {
      type: Number,
      default: 0,
    },
    failed_jobs: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Jobs",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const ImportLogs = model("import_log", schema);
