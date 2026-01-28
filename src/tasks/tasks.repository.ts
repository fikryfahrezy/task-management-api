import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../core/database.service";
import { type Task } from "./task.types";

@Injectable()
export class TasksRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async listTasks(limit: number, offset: number): Promise<[Task[], number]> {
    const result = await this.databaseService.sql<(Task & { total: number })[]>`
      SELECT id, title, description, status, user_id, COUNT(*) OVER() AS total
      FROM tasks
      WHERE deleted_at IS NULL
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const tasks = result.map(({ total: _, ...task }) => task);
    const total = result[0]?.total ?? 0;

    return [tasks, total];
  }

  async getTaskById(id: number): Promise<Task | null> {
    const [task] = await this.databaseService.sql<Task[]>`
      SELECT id, title, description, status, user_id
      FROM tasks
      WHERE id = ${id} AND deleted_at IS NULL
    `;

    return task ?? null;
  }

  async createTask(createDto: Omit<Task, "id">): Promise<Task> {
    const [task] = await this.databaseService.sql<Task[]>`
      INSERT INTO tasks  ${this.databaseService.sql(createDto)}
      RETURNING id, title, description, status, user_id
    `;

    return task;
  }

  async updateTask(id: number, task: Omit<Partial<Task>, "id">): Promise<Task> {
    const [updated] = await this.databaseService.sql<Task[]>`
    UPDATE tasks SET
      title = COALESCE(update_data.title, title),
      description = COALESCE(update_data.description, description),
      status = COALESCE(update_data.status, status),
      user_id = COALESCE(update_data.user_id, user_id),
      updated_at = NOW()
    FROM (VALUES ${this.databaseService.sql(task)}) AS update_data (title, description, status, user_id)
    WHERE id = ${id}
    RETURNING id, title, description, status, user_id
    `;

    return updated;
  }

  async softDeleteTask(id: number): Promise<void> {
    await this.databaseService.sql`
      UPDATE tasks
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id}
    `;
  }
}
