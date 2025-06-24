import { Schema, model } from "models";
const schema = new Schema(
  {
    import_date: {
      type: Date,
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
export const ImportLogs = model("ImportLog", schema);
