import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { TaskStatuses } from "../task.types";

export class CreateTaskDto {
  @ApiProperty({ example: "Write API docs" })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: "Document task management API" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "pending", enum: TaskStatuses })
  @IsOptional()
  @IsIn(TaskStatuses)
  status?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id!: number;
}
