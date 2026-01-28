import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { TaskStatuses, type TaskStatus } from "../task.types";

export class ListTasksQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class TaskResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "Write API docs" })
  title: string;

  @ApiPropertyOptional({
    example: "Document task management API",
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: "pending", enum: TaskStatuses })
  status: TaskStatus;

  @ApiProperty({ example: 1 })
  user_id: number;

  constructor(obj: TaskResDto) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.status = obj.status;
    this.user_id = obj.user_id;
  }
}

export class TaskListMetaResDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;
}

export class TaskListResDto {
  @ApiProperty({ type: [TaskResDto] })
  data: TaskResDto[];

  @ApiProperty({ type: TaskListMetaResDto })
  meta: TaskListMetaResDto;

  constructor(obj: TaskListResDto) {
    this.data = obj.data;
    this.meta = obj.meta;
  }
}
