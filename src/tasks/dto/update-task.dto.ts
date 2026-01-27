import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { TaskStatuses } from "../task.types";

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: "Update API docs" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: "Add pagination section" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "done", enum: TaskStatuses })
  @IsOptional()
  @IsIn(TaskStatuses)
  status?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id?: number;
}
