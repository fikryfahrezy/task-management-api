import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "../core/database.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task, TaskStatus } from "./task.types";

type TaskListResponse = {
  data: Task[];
  meta: { page: number; limit: number; total: number };
};

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async listTasks(page: number, limit: number): Promise<TaskListResponse> {
    const offset = (page - 1) * limit;
    const [{ total }] = await this.databaseService.sql<
      { total: number }[]
    >`SELECT COUNT(*)::int AS total FROM tasks WHERE deleted_at IS NULL`;

    const tasks = await this.databaseService.sql<Task[]>`
      SELECT id, title, description, status, user_id
      FROM tasks
      WHERE deleted_at IS NULL
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return {
      data: tasks,
      meta: { page, limit, total },
    };
  }

  async getTask(id: number): Promise<Task> {
    const tasks = await this.databaseService.sql<Task[]>`
      SELECT id, title, description, status, user_id
      FROM tasks
      WHERE id = ${id} AND deleted_at IS NULL
    `;

    const task = tasks[0];
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async createTask(createDto: CreateTaskDto): Promise<Task> {
    const status = (createDto.status ?? "pending") as TaskStatus;

    const tasks = await this.databaseService.sql<Task[]>`
      INSERT INTO tasks (title, description, status, user_id)
      VALUES (${createDto.title}, ${createDto.description ?? null}, ${status}, ${createDto.user_id})
      RETURNING id, title, description, status, user_id
    `;

    return tasks[0];
  }

  async updateTask(id: number, updateDto: UpdateTaskDto): Promise<Task> {
    const fields: { key: string; value: unknown }[] = [];

    if (typeof updateDto.title !== "undefined") {
      fields.push({ key: "title", value: updateDto.title });
    }

    if (typeof updateDto.description !== "undefined") {
      fields.push({ key: "description", value: updateDto.description });
    }

    if (typeof updateDto.status !== "undefined") {
      fields.push({ key: "status", value: updateDto.status });
    }

    if (typeof updateDto.user_id !== "undefined") {
      fields.push({ key: "user_id", value: updateDto.user_id });
    }

    if (fields.length === 0) {
      throw new BadRequestException("No fields to update");
    }

    const tasks = await this.databaseService.sql<Task[]>`
      SELECT id FROM tasks WHERE id = ${id} AND deleted_at IS NULL
    `;

    if (!tasks[0]) {
      throw new NotFoundException("Task not found");
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const field of fields) {
      updates.push(`${field.key} = $${values.length + 1}`);
      values.push(field.value);
    }

    values.push(id);
    const updated = await this.databaseService.sql.unsafe<Task[]>(
      `UPDATE tasks
       SET ${updates.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length}
       RETURNING id, title, description, status, user_id`,
      values as unknown as Array<string | number | boolean | null>,
    );

    return updated[0];
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    const tasks = await this.databaseService.sql<Task[]>`
      SELECT id FROM tasks WHERE id = ${id} AND deleted_at IS NULL
    `;

    if (!tasks[0]) {
      throw new NotFoundException("Task not found");
    }

    await this.databaseService.sql`
      UPDATE tasks
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id}
    `;

    return { message: "Task deleted" };
  }
}
