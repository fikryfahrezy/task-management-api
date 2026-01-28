import { Test } from "@nestjs/testing";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskListResDto, TaskDto, TaskResDto } from "./dto/list-tasks.dto";
import { TokenGuard } from "../guards/token.guard";

const baseTask = new TaskDto({
  id: 1,
  title: "Task 1",
  description: "Description",
  status: "pending",
  user_id: 1,
});

describe("TasksController", () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            listTasks: jest.fn(),
            getTask: jest.fn(),
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get(TasksController);
    service = moduleRef.get(TasksService);
  });

  it("should list tasks with default page/limit", async () => {
    const response = new TaskListResDto({
      message: "Tasks retrieved successfully",
      data: [baseTask],
      meta: { page: 1, limit: 10, total: 1 },
    });

    const listSpy = jest
      .spyOn(service, "listTasks")
      .mockResolvedValue(response);

    const result = await controller.listTasks({});

    expect(result).toEqual(response);
    expect(listSpy).toHaveBeenCalledWith(1, 10);
  });

  it("should get task", async () => {
    const expected = new TaskResDto({
      message: "Task retrieved successfully",
      data: baseTask,
    });
    jest.spyOn(service, "getTask").mockResolvedValue(expected);

    const result = await controller.getTask(1);
    expect(result).toEqual(expected);
  });

  it("should create task", async () => {
    const dto: CreateTaskDto = {
      title: "Create",
      description: "Description",
      status: "pending",
      user_id: 1,
    };

    const expected = new TaskResDto({
      message: "Task created successfully",
      data: baseTask,
    });
    jest.spyOn(service, "createTask").mockResolvedValue(expected);

    const result = await controller.createTask(dto);
    expect(result).toEqual(expected);
  });

  it("should update task", async () => {
    const dto: UpdateTaskDto = { title: "Updated" };
    const expected = new TaskResDto({
      message: "Task updated successfully",
      data: baseTask,
    });
    jest.spyOn(service, "updateTask").mockResolvedValue(expected);

    const result = await controller.updateTask(1, dto);
    expect(result).toEqual(expected);
  });

  it("should delete task", async () => {
    const expected = new TaskResDto({
      message: "Task deleted successfully",
      data: baseTask,
    });
    jest.spyOn(service, "deleteTask").mockResolvedValue(expected);

    const result = await controller.deleteTask(1);
    expect(result).toEqual(expected);
  });
});
