import { Test } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginReqDto, LoginResDto, LoginTokenDto } from "./dto/login.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
    authService = moduleRef.get(AuthService);
  });

  it("should return login response", () => {
    const dto: LoginReqDto = {
      email: "admin@example.com",
      password: "password123",
    };

    const response = new LoginResDto({
      message: "Login successful",
      data: new LoginTokenDto({ token: "secret-token-123" }),
    });
    jest.spyOn(authService, "login").mockReturnValue(response);

    expect(controller.login(dto)).toEqual(response);
  });
});
