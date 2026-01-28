import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginReqDto {
  @ApiProperty({ example: "admin@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginResDto {
  @ApiProperty({ example: "abc123xyz" })
  token: string;

  constructor(obj: LoginResDto) {
    this.token = obj.token;
  }
}
