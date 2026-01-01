import { Connection, Schema } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  assignedTo: string; // employee email
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: Date;
  createdAt: Date;
}

export const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
    default: "PENDING",
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export function getTaskModel(conn: Connection) {
  return conn.models.Task || conn.model<ITask>("Task", TaskSchema);
}
