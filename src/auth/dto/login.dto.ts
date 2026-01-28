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

export class LoginTokenDto {
  @ApiProperty({ example: "abc123xyz" })
  token: string;

  constructor(obj: LoginTokenDto) {
    this.token = obj.token;
  }
}

export class LoginResDto {
  @ApiProperty({ example: "Login successful" })
  message: string;

  @ApiProperty({ type: LoginTokenDto })
  data: LoginTokenDto;

  constructor(obj: LoginResDto) {
    this.message = obj.message;
    this.data = obj.data;
  }
}
