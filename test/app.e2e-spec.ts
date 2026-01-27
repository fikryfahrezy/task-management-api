import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import postgres from "postgres";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { CatchEverythingFilter } from "./../src/filters/catch-everything-filter";

describe("Task Management API (e2e)", () => {
  let app: INestApplication<App>;
  let sql: ReturnType<typeof postgres>;

  const authToken = "secret-token-123";
  const testTitle = "test-task-title";

  beforeAll(() => {
    process.env.POSTGRES_HOST = process.env.POSTGRES_HOST ?? "127.0.0.1";
    process.env.POSTGRES_PORT = process.env.POSTGRES_PORT ?? "5432";
    process.env.POSTGRES_DB = process.env.POSTGRES_DB ?? "postgres";
    process.env.POSTGRES_USER = process.env.POSTGRES_USER ?? "postgres";
    process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "postgres";
    process.env.AUTH_TOKEN = process.env.AUTH_TOKEN ?? authToken;
    process.env.PORT = process.env.PORT ?? "3001";

    sql = postgres({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      db: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    });
  });

  afterAll(async () => {
    await sql`
      DELETE FROM tasks WHERE title = ${testTitle}
    `;
    await sql.end();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("/api");
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new CatchEverythingFilter(httpAdapter));

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/api/login (POST) should return token", () => {
    return request(app.getHttpServer())
      .post("/api/login")
      .send({ email: "admin@example.com", password: "password123" })
      .expect(200)
      .expect({ token: authToken });
  });

  it("/api/login (POST) should return invalid credentials", () => {
    return request(app.getHttpServer())
      .post("/api/login")
      .send({ email: "wrong@example.com", password: "invalid" })
      .expect(401)
      .expect({ message: "Invalid credentials" });
  });

  it("/api/tasks (GET) should require auth", () => {
    return request(app.getHttpServer()).get("/api/tasks").expect(401);
  });

  it("/api/tasks (POST) should create and list task", async () => {
    const createResponse = await request(app.getHttpServer())
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: testTitle,
        description: "Test task description",
        status: "pending",
        user_id: 1,
      })
      .expect(201);

    expect((createResponse.body as { title: string }).title).toBe(testTitle);

    const listResponse = await request(app.getHttpServer())
      .get("/api/tasks?page=1&limit=5")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray((listResponse.body as { data: unknown[] }).data)).toBe(
      true,
    );
  });
});
