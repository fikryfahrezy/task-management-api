import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import postgres from "postgres";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { CatchEverythingFilter } from "./../src/filters/catch-everything-filter";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import fs from "fs/promises";
import path from "path";

describe("Task Management API (e2e)", () => {
  jest.setTimeout(60000);

  let postgresContainer: StartedPostgreSqlContainer;
  let sql: ReturnType<typeof postgres>;
  let app: INestApplication<App>;
  let userId: number;

  const authToken = "secret-token-123";
  const testTitle = "test-task-title";

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer(
      "postgres:18.1-bookworm",
    ).start();

    process.env.POSTGRES_HOST = postgresContainer.getHost();
    process.env.POSTGRES_PORT = String(postgresContainer.getPort());
    process.env.POSTGRES_DB = postgresContainer.getDatabase();
    process.env.POSTGRES_USER = postgresContainer.getUsername();
    process.env.POSTGRES_PASSWORD = postgresContainer.getPassword();
    process.env.AUTH_TOKEN = authToken;

    sql = postgres({
      host: postgresContainer.getHost(),
      port: postgresContainer.getPort(),
      db: postgresContainer.getDatabase(),
      user: postgresContainer.getUsername(),
      password: postgresContainer.getPassword(),
    });

    const migrationsPath = path.join(__dirname, "..", "migrations");
    const entries = await fs.readdir(migrationsPath, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const dir of dirs) {
      const file = path.join(migrationsPath, dir, "index.sql");
      const sqlText = await fs.readFile(file, "utf8");
      console.log("Migrating", dir);
      await sql.unsafe(sqlText);
    }

    const [user] = await sql<{ id: number }[]>`
      INSERT INTO users (name, email)
      VALUES ('test', 'test@example.com')
      RETURNING id
    `;
    userId = user.id;
  });

  afterAll(async () => {
    await sql`
      DELETE FROM tasks WHERE title = ${testTitle}
    `;
    await sql.end();
    await postgresContainer.stop();
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
      .expect({
        name: "UnauthorizedException",
        message: "Invalid credentials",
        errors: [],
      });
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
        user_id: userId,
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
