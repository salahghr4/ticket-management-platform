# TyTicket Platform

TyTicket is a modern ticket management platform built with React (Vite), TypeScript, Tailwind CSS, and Laravel. It provides a robust solution for managing support tickets, users, and departments with a clean, responsive UI and a secure backend API.

---

## Features

- User authentication and profile management (login, update profile, change password).
- Ticket creation, updating, deleting , assignment, and tracking with status updates and comments.
- Attachments for tickets.
- Department and user management (CRUD operations)
- Responsive, modern UI with dark/light mode.
- Role-based access control
- Dashboard and statistics for ticket analytics
- Search and filter tickets by status, department, assignee, and more

---

## Tech Stack

### Frontend

- React + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui component library
- React Router

### Backend

- Laravel (PHP)
- RESTful API
- Eloquent ORM
- Laravel Sanctum (API authentication)
- Cloudinary (for ticket attachment storage)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PHP (v8.1+ recommended)
- Composer
- MySQL/PostgreSQL/SQLite (or other supported DB)

### Installation

#### 1. Clone the repository

```sh
git clone <your-repo-url>
cd ticket-management-platform
```

#### 2. Install dependencies

**Frontend:**

```sh
cd client
npm install
```

**Backend:**

```sh
cd ../server
composer install
```

#### 3. Environment setup

- Copy `.env.example` to `.env` in the `server` directory and configure your database and mail settings.
- Add `VITE_API_URL=http://localhost:8000/api` or your api url  to `.env` in the `client` directory
- Generate Laravel app key:

```sh
php artisan key:generate
```

#### 4. Database setup

```sh
php artisan migrate --seed
```

#### 5. Running queues

```sh
php artisan queue:work
```

#### 6. Running the app

**Backend (Laravel):**

```sh
php artisan serve
```

**Frontend (Vite):**

```sh
cd ../client
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

---

## Project Structure

```
client/      # React frontend
server/      # Laravel backend
```

---

---

## API Endpoints

| Method | Endpoint | Params/Body(JSON) | Description               | Auth Required |
| ------ | -------- | ----------------- | ------------------------- | ------------- |
| POST   | /login   | email, password   | Login and get token       | No            |
| POST   | /logout  | -                 | Logout (invalidate token) | Yes           |
| GET    | /me      | -                 | Get current user info     | Yes           |

### Tickets

| Method | Endpoint          | Params/Body (JSON)                                                         | Description                      | Auth Required |
| ------ | ----------------- | -------------------------------------------------------------------------- | -------------------------------- | ------------- |
| GET    | /tickets          | -                                                                          | List all tickets                 | Yes           |
| POST   | /tickets          | title, description, priority, department_id, assigned_to, due_date, status | Create ticket                    | Yes           |
| GET    | /tickets/{id}     | -                                                                          | Get ticket details               | Yes           |
| PUT    | /tickets/{id}     | title, description, priority, department_id, assigned_to, due_date, status | Update ticket                    | Yes           |
| DELETE | /tickets/{id}     | -                                                                          | Delete ticket                    | Yes           |
| GET    | /tickets/assigned | -                                                                          | Tickets assigned to current user | Yes           |
| GET    | /tickets/created  | -                                                                          | Tickets created by current user  | Yes           |
| GET    | /tickets/stats    | -                                                                          | Ticket statistics                | Yes           |

### Attachments

| Method | Endpoint                           | Params/Body (FormData) | Description                   | Auth Required |
| ------ | ---------------------------------- | ---------------------- | ----------------------------- | ------------- |
| GET    | /tickets/{ticket}/attachments      | -                      | List attachments for a ticket | Yes           |
| POST   | /tickets/{ticket}/attachments      | attachments[] (file)   | Upload attachment(s)          | Yes           |
| DELETE | /tickets/{ticket}/attachments/{id} | -                      | Delete attachment             | Yes           |

### Comments

| Method | Endpoint                                     | Params/Body (JSON)            | Description                | Auth Required |
| ------ | -------------------------------------------- | ----------------------------- | -------------------------- | ------------- |
| GET    | /tickets/{ticket}/comments                   | -                             | List comments for a ticket | Yes           |
| POST   | /tickets/{ticket}/comments                   | content, parent_id (optional) | Add comment                | Yes           |
| PUT    | /tickets/{ticket}/comments/{comment}         | content                       | Update comment             | Yes           |
| DELETE | /tickets/{ticket}/comments/{comment}         | -                             | Delete comment             | Yes           |
| GET    | /tickets/{ticket}/comments/{comment}/replies | -                             | List replies to a comment  | Yes           |
| POST   | /comments/{comment}/replies                  | content                       | Add reply to comment       | Yes           |
| PUT    | /comments/{comment}/replies/{reply}          | content                       | Update reply               | Yes           |
| DELETE | /comments/{comment}/replies/{reply}          | -                             | Delete reply               | Yes           |

### Users

| Method | Endpoint                         | Params/Body (JSON)                                    | Description                | Auth Required |
| ------ | -------------------------------- | ----------------------------------------------------- | -------------------------- | ------------- |
| GET    | /users                           | -                                                     | List users                 | Yes           |
| POST   | /users                           | name, email, password, role, department_id            | Create user                | Yes           |
| GET    | /users/{id}                      | -                                                     | Get user details           | Yes           |
| PUT    | /users/{id}                      | name, email, password (optional), role, department_id | Update user                | Yes           |
| DELETE | /users/{id}                      | -                                                     | Delete user                | Yes           |
| GET    | /users/department/{departmentId} | -                                                     | List users in a department | Yes           |

### Departments

| Method | Endpoint          | Params/Body (JSON) | Description            | Auth Required |
| ------ | ----------------- | ------------------ | ---------------------- | ------------- |
| GET    | /departments      | -                  | List departments       | Yes           |
| POST   | /departments      | name               | Create department      | Yes           |
| GET    | /departments/{id} | -                  | Get department details | Yes           |
| PUT    | /departments/{id} | name               | Update department      | Yes           |
| DELETE | /departments/{id} | -                  | Delete department      | Yes           |

### Profile & Password

| Method | Endpoint  | Params/Body (JSON)                                | Description     | Auth Required |
| ------ | --------- | ------------------------------------------------- | --------------- | ------------- |
| PATCH  | /profile  | name, email                                       | Update profile  | Yes           |
| PUT    | /password | current_password, password, password_confirmation | Change password | Yes           |

---

> All endpoints (except /login) require authentication via Bearer token (Laravel Sanctum).

---

## Contributing

Contributions are welcome! Fork the repo, create a branch, make your changes, and open a pull request.