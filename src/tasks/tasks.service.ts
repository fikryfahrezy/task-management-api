import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksRepository } from "./tasks.repository";
import { TaskStatus } from "./task.types";
import { TaskDto, TaskListResDto, TaskResDto } from "./dto/list-tasks.dto";

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async listTasks(page: number, limit: number): Promise<TaskListResDto> {
    const offset = (page - 1) * limit;
    const [tasks, total] = await this.tasksRepository.listTasks(limit, offset);

    const taskDtos = tasks.map((task) => new TaskDto(task));
    return new TaskListResDto({
      message: "Tasks retrieved successfully",
      data: taskDtos,
      meta: { page, limit, total },
    });
  }

  async getTask(id: number): Promise<TaskResDto> {
    const task = await this.tasksRepository.getTaskById(id);
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return new TaskResDto({
      message: "Task retrieved successfully",
      data: new TaskDto(task),
    });
  }

  async createTask(createDto: CreateTaskDto): Promise<TaskResDto> {
    const status = (createDto.status ?? "pending") as TaskStatus;
    const createdTask = await this.tasksRepository.createTask({
      ...createDto,
      description: createDto.description ?? null,
      status: status,
    });

    return new TaskResDto({
      message: "Task created successfully",
      data: new TaskDto(createdTask),
    });
  }

  async updateTask(id: number, updateDto: UpdateTaskDto): Promise<TaskResDto> {
    if (Object.keys(updateDto).length === 0) {
      throw new BadRequestException("No fields to update");
    }

    const existing = await this.tasksRepository.getTaskById(id);
    if (!existing) {
      throw new NotFoundException("Task not found");
    }

    const status = (updateDto.status ?? "pending") as TaskStatus;
    const updatedTask = await this.tasksRepository.updateTask(id, {
      ...updateDto,
      description: updateDto.description ?? null,
      status: status,
    });

    return new TaskResDto({
      message: "Task updated successfully",
      data: new TaskDto(updatedTask),
    });
  }

  async deleteTask(id: number): Promise<TaskResDto> {
    const existing = await this.tasksRepository.getTaskById(id);
    if (!existing) {
      throw new NotFoundException("Task not found");
    }

    await this.tasksRepository.softDeleteTask(id);

    return new TaskResDto({
      message: "Task deleted successfully",
      data: new TaskDto(existing),
    });
  }
}
