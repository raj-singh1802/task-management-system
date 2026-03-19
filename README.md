# Task Management System

A full-stack task management application built with:

- **Backend:** Node.js, TypeScript, Express, Prisma, JWT
- **Frontend:** Next.js, TypeScript
- **Database:** SQLite (dev) / PostgreSQL (prod)

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and get tokens
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Logout

### Tasks

- `GET /tasks` — Get all tasks (pagination, filter, search)
- `POST /tasks` — Create a task
- `GET /tasks/:id` — Get single task
- `PUT /tasks/:id` — Update a task
- `DELETE /tasks/:id` — Delete a task
- `PATCH /tasks/:id/toggle` — Toggle task status
