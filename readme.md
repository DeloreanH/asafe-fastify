---
# Node.js Application Overview

This project is a Node.js application built using **Fastify** and **Prisma**, offering a structured and scalable foundation for building web applications. Below is an overview of the project structure, setup instructions, and available commands.

## Table of Contents
- [Project Structure](#project-structure)
- [Running the Application Locally](#running-the-application-locally)
- [Swagger Documentation](#swagger-documentation)
- [Heroku Instance Links](#heroku-instance-links)
- [Usage Tips](#usage-tips)
- [Role and Permissions](#role-and-permissions)
- [Avatar File Upload Considerations](#avatar-file-upload-considerations)

## Project Structure

- **node_modules/**: Contains all project dependencies.
  
- **src/**: Application source code, organized as follows:
  - **config/**: Contains application configuration files.
  - **hooks/**: Custom hooks to encapsulate reusable logic.
  - **modules/**: Feature-specific modules. Each module is self-contained with its own:
    - **schemas/**: Holds the controller, service, and route files for the module, alongside their corresponding test files.

    **Example Module Structure:**
    ```plaintext
    - modules/
      - example/
        - schemas/
          - example.controller.ts       # Handles requests
          - example.service.ts          # Business logic
          - example.routes.ts           # Route definitions
          - example.controller.spec.ts  # Unit tests for the controller
          - example.service.spec.ts     # Unit tests for the service
          - example.module.ts           # Module definition
    ```

  - **core.ts**: Single entry point for loading all modules and routes.
  - **schemas/**: Contains reusable schemas shared across multiple modules.
  - **server/**: Server-related setup and configurations.
    - **plugins/**: Fastify plugins that are auto-loaded at runtime.
    - **prisma/**: Prisma setup and configuration files.
    - **shared/**: Utility functions, classes, and type definitions.

  - **index.ts**: Main entry point of the application.

- **.env**: Configuration file for managing environment variables (used for various aspects of the application).

## Running the Application Locally

To run the application locally, follow these steps:

### Prerequisites

Make sure the following are installed on your machine:
- **Docker**: [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Node.js**: [Download Node.js](https://nodejs.org/)

### Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
LOG_LEVEL=info
NODE_ENV=development
PORT=3000
POSTGRES_PASSWORD=
POSTGRES_USER=
POSTGRES_DB=asafe
POSTGRES_URL=127.0.0.1:5432
JWT_SECRET=
JWT_EXPIRE_TIME=3600 # time in seconds
BUCKET_NAME= # Google Cloud bucket name

# Database URL for Prisma
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/asafe?schema=public"
```

**Optional:** To use the file upload endpoint, you will need a Google Cloud service account. Configure it as follows:

```env
# Google Cloud bucket upload configuration
GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"  # Unix
set GOOGLE_APPLICATION_CREDENTIALS=path\to\key.json  # Windows
```

### Step-by-Step Instructions

1. **Run Docker Compose** (if you don’t already have a PostgreSQL instance running):
   ```bash
   docker-compose up -d
   ```
   
2. **Install dependencies**:
   ```bash
   npm install
   ```
   
3. **run prisma migrations**:
   ```bash
   npm run migrate:dev
   ```

4. **Start the application in development mode**:
   ```bash
   npm run start:dev
   ```

5. Access Swagger documentation at:
   ```
   http://localhost:{PORT || 3000}/api-docs
   ```

## Heroku Instance Links

Access the deployed application via the following links:

- **Swagger Documentation**: [API Docs](https://obscure-citadel-07942-80e0c3c28081.herokuapp.com/api-docs)
- **API Endpoint**: [API](https://obscure-citadel-07942-80e0c3c28081.herokuapp.com/api)
- **WebSocket Connection**: `ws://obscure-citadel-07942-80e0c3c28081.herokuapp.com/ws/conn` (for real-time updates on user changes via `PATCH /user/{uuid}`)

## Usage Tips

To explore the API, begin by using the signup endpoint to create an account. You can then authenticate via Swagger or Postman, ensuring to add your Bearer token for authorized requests.

## Role and Permissions

Here is a breakdown of the required permissions for each user endpoint in the Fastify `UserRoutes` configuration:

### User Endpoints

| Endpoint               | Method | Required Permissions       | Description                     |
|------------------------|--------|----------------------------|---------------------------------|
| `/user`                | POST   | `Permission.WriteAll`       | Create a new user               |
| `/user`                | GET    | `Permission.WriteAll`       | Retrieve all users              |
| `/user/:uuid`          | GET    | `Permission.ReadAll`        | Retrieve user by UUID           |
| `/user/:uuid`          | PATCH  | `Permission.WriteAll`       | Update user by UUID             |
| `/user/:uuid`          | DELETE | `Permission.DeleteAll`      | Delete user by UUID             |
| `/user/avatar`         | PATCH  | all                        | Update user avatar              |

### Post Routes Permissions

| Endpoint               | Method | Required Permissions                             | Description                     |
|------------------------|--------|--------------------------------------------------|---------------------------------|
| `/post`                | POST   | `Permission.WriteOwn`, `Permission.WriteAll`     | Create a new post               |
| `/post`                | GET    | `Permission.ReadOwn`, `Permission.WriteAll`      | Retrieve all user posts         |
| `/post/:uuid`          | GET    | `Permission.ReadOwn`, `Permission.ReadAll`       | Retrieve post by UUID           |
| `/post/:uuid`          | PATCH  | `Permission.WriteOwn`, `Permission.WriteAll`     | Update post by UUID             |
| `/post/:uuid`          | DELETE | `Permission.DeleteAll`                           | Delete post by UUID             |

### Permission Types

| Permission         | Description                                           |
|--------------------|-------------------------------------------------------|
| `read:all`         | Allows reading all resources                          |
| `write:all`        | Allows writing to all resources                       |
| `delete:all`       | Allows deletion of all resources                      |
| `read:own`         | Allows reading resources owned by the authenticated user |
| `write:own`        | Allows writing to resources owned by the authenticated user |
| `delete:own`       | Allows deletion of resources owned by the authenticated user |

### Role-Based Permissions

| Role           | Permissions                                          |
|----------------|------------------------------------------------------|
| `ADMIN`        | `read:all`, `write:all`, `delete:all`                |
| `BASIC`        | `read:own`, `write:own`, `delete:own`                |

## Avatar File Upload Considerations

Testing the avatar upload feature is easiest through Postman or cURL. It may not be available in Swagger due to implementation constraints.

### Steps to Upload an Avatar using Postman:

1. Start **Postman**.
2. Set the HTTP method to **PATCH**.
3. Set the request URL to:
   ```
   https://obscure-citadel-07942-80e0c3c28081.herokuapp.com/user/avatar
   ```
4. In the **Authorization** tab, select **Bearer Token** and input your token.
5. Go to the **Body** tab and choose **form-data**.
6. Add a key:
   - Key: `avatar` (`file` or  `leave it blank`)
   - Type: **File**
   - Value: Select the file you want to upload.
7. Click **Send** to submit the request.

---