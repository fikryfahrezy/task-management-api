import { BadRequestException, NotFoundException } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksRepository } from "./tasks.repository";
import { TaskResDto, TaskListResDto, TaskDto } from "./dto/list-tasks.dto";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

const baseTask = {
  id: 1,
  title: "Task 1",
  description: "Description",
  status: "pending" as const,
  user_id: 1,
};

describe("TasksService", () => {
  let tasksService: TasksService;
  let tasksRepository: { [key in keyof TasksRepository]: jest.Mock };

  beforeEach(() => {
    tasksRepository = {
      listTasks: jest.fn(),
      getTaskById: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      softDeleteTask: jest.fn(),
    };

    tasksService = new TasksService(
      tasksRepository as unknown as TasksRepository,
    );
  });

  it("should list tasks", async () => {
    tasksRepository.listTasks.mockResolvedValue([[baseTask], 1]);

    const result = await tasksService.listTasks(1, 10);

    expect(result).toBeInstanceOf(TaskListResDto);
    expect(result.data[0]).toBeInstanceOf(TaskDto);
    expect(result.meta.total).toBe(1);
  });

  it("should get task by id", async () => {
    tasksRepository.getTaskById.mockResolvedValue(baseTask);

    const result = await tasksService.getTask(1);

    expect(result).toBeInstanceOf(TaskResDto);
    expect(result.data.id).toBe(1);
  });

  it("should throw when task not found", async () => {
    tasksRepository.getTaskById.mockResolvedValue(null);

    await expect(tasksService.getTask(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should create task", async () => {
    const dto: CreateTaskDto = {
      title: "Create",
      description: undefined,
      status: undefined,
      user_id: 1,
    };

    tasksRepository.createTask.mockResolvedValue({
      ...baseTask,
      title: "Create",
      description: null,
    });

    const result = await tasksService.createTask(dto);

    expect(result).toBeInstanceOf(TaskResDto);
    expect(result.data.title).toBe("Create");
  });

  it("should update task", async () => {
    const dto: UpdateTaskDto = {
      title: "Updated",
    };

    tasksRepository.getTaskById.mockResolvedValue(baseTask);
    tasksRepository.updateTask.mockResolvedValue({
      ...baseTask,
      title: "Updated",
    });

    const result = await tasksService.updateTask(1, dto);

    expect(result).toBeInstanceOf(TaskResDto);
    expect(result.data.title).toBe("Updated");
  });

  it("should throw when update payload is empty", async () => {
    await expect(tasksService.updateTask(1, {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("should throw when updating missing task", async () => {
    tasksRepository.getTaskById.mockResolvedValue(null);

    await expect(
      tasksService.updateTask(1, { title: "Updated" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should delete task", async () => {
    tasksRepository.getTaskById.mockResolvedValue(baseTask);
    const deleteSpy = jest
      .spyOn(tasksRepository, "softDeleteTask")
      .mockResolvedValue(undefined);

    const result = await tasksService.deleteTask(1);

    expect(result).toBeInstanceOf(TaskResDto);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should throw when deleting missing task", async () => {
    tasksRepository.getTaskById.mockResolvedValue(null);

    await expect(tasksService.deleteTask(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
