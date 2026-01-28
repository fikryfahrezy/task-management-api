# Task Management API

## Project setup

```bash
$ pnpm install
```

```bash
$ cp .env.example .env
```

```bash
POSTGRES_HOST=localhost           # The PostgreSQL database server host
POSTGRES_PORT=5432                # The PostgreSQL database server port
POSTGRES_DB=postgres              # The database name to use
POSTGRES_USER=postgres            # The username for connecting to the database
POSTGRES_PASSWORD=postgres        # The password of the username
PORT=3000                         # The server port
AUTH_TOKEN=secret-token-123       # Token for authorize API request
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Run using Docker

```bash
# With Docker Compose without Database
docker compose up  --build

# With Docker Compose with Database
docker compose -f compose-with-db.yaml up  --build
```

## Project Structure

```bash
src/                              # the root of project codes
|__config/                        # codes that provide any config or env used by the project
|__core/                          # codes that bridge to any 3rd party library or dependencies
|__filters/                       # global filter used by the project
|__guards/                        # shareable guards across the project
|__middleware/                    # collections of API middlewars
|__[domain]/                      # domain specific code
|____dto/
|______[action].dto.ts            # input/output contract data from and to presentation in the domain
|____[domain].controller.spec.ts  # test for the presentation layer
|____[domain].controller.ts       # presentation layer of the domain
|____[domain].module.ts           # Nest module for the domain
|____[domain].repository.ts       # data layer related to the domain
|____[domain].service.spec.ts     # test for the orchastration layer
|____[domain].service.ts          # orchastration layer between presentation and data layer
```

## API Endpoints

### Auth

#### Login

##### Request

```bash
curl --request POST \
  --url http://localhost:3000/api/login \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "admin@example.com",
  "password": "password123"
}'
```

##### Response (200)

```json
{
  "message": "Login successful",
  "data": {
    "token": "secret-token-123"
  }
}
```

### Task

#### Get List Task

##### Request

```bash
curl --request GET \
  --url 'http://localhost:3000/api/tasks?page=1&limit=10' \
  --header 'Authorization: Bearer secret-token-123'
```

##### Response (200)

```json
{
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 11,
      "title": "Write API docs",
      "description": "Document task management API",
      "status": "pending",
      "user_id": 1
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8
  }
}
```

#### Get Detail Task

##### Request

```bash
curl --request GET \
  --url http://localhost:3000/api/tasks/1 \
  --header 'Authorization: Bearer secret-token-123'
```

##### Response (200)

```json
{
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "title": "test-task-title",
    "description": "Test task description",
    "status": "pending",
    "user_id": 1
  }
}
```

#### Create Task

##### Request

```bash
curl --request POST \
  --url http://localhost:3000/api/tasks \
  --header 'Authorization: Bearer secret-token-123' \
  --header 'Content-Type: application/json' \
  --data '{
  "title": "Write API docs",
  "description": "Document task management API",
  "status": "pending",
  "user_id": 1
}'
```

##### Response (201)

```json
{
  "message": "Task created successfully",
  "data": {
    "id": 11,
    "title": "Write API docs",
    "description": "Document task management API",
    "status": "pending",
    "user_id": 1
  }
}
```

#### Update Task

##### Request

```bash
curl --request PUT \
  --url http://localhost:3000/api/tasks/1 \
  --header 'Authorization: Bearer secret-token-123' \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "Write API docs",
	"description": "Document task management API",
	"status": "done",
  "user_id": 1
}'
```

##### Response (200)

```json
{
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Write API docs",
    "description": "Document task management API",
    "status": "done",
    "user_id": 1
  }
}
```

#### Delete Task

##### Request

```bash
curl --request DELETE \
  --url http://localhost:3000/api/tasks/1 \
  --header 'Authorization: Bearer secret-token-123'
```

##### Response (200)

```json
{
  "message": "Task deleted successfully",
  "data": {
    "id": 1,
    "title": "Write API docs",
    "description": "Document task management API",
    "status": "done",
    "user_id": 1
  }
}
```
