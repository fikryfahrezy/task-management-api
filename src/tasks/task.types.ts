export const TaskStatuses = ["pending", "done"] as const;
export type TaskStatus = (typeof TaskStatuses)[number];

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  user_id: number;
};
