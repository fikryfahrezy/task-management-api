import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TokenGuard } from "../guards/token.guard";
import { CreateTaskDto } from "./dto/create-task.dto";
import {
  ListTasksQueryDto,
  TaskListResDto,
  TaskResDto,
} from "./dto/list-tasks.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksService } from "./tasks.service";

@ApiTags("tasks")
@ApiBearerAuth()
@UseGuards(TokenGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOkResponse({ type: TaskListResDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  listTasks(@Query() query: ListTasksQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.tasksService.listTasks(page, limit);
  }

  @Get(":id")
  @ApiOkResponse({ type: TaskResDto })
  @ApiNotFoundResponse({ type: NotFoundException })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  getTask(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.getTask(id);
  }

  @Post()
  @ApiCreatedResponse({ type: TaskResDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(":id")
  @ApiOkResponse({ type: TaskResDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  @ApiNotFoundResponse({ type: NotFoundException })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(":id")
  @HttpCode(200)
  @ApiOkResponse({ type: TaskResDto })
  @ApiNotFoundResponse({ type: NotFoundException })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  deleteTask(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
