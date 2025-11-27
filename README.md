# Expendi Server

A robust backend API for the Expendi application, designed to manage personal finances with ease. Built with modern web technologies, it provides secure authentication and efficient handling of income and expense data.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Expense Management**: Create, read, update, and delete expense records.
- **Income Management**: Track various sources of income.
- **Secure Architecture**: Implements Helmet for security headers and CORS configuration.
- **Data Validation**: Robust request validation using Zod.
- **Database**: Powered by PostgreSQL (Neon Serverless) and Drizzle ORM for type-safe database interactions.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

## ⚙️ Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd expendi/server
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    NODE_ENV=development
    DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Database Setup**

    Generate migrations and push schema changes to the database:

    ```bash
    npm run db:generate
    npm run db:migrate
    ```

## 🏃‍♂️ Usage

### Development

Run the server in development mode with hot reloading:

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

### Production

Build and start the production server:

```bash
npm run build
npm start
```

### Testing

Run the test suite:

```bash
npm test
```

## 📡 API Endpoints

Base URL: `/api/v1`

| Feature      | Endpoint    | Description                             |
| :----------- | :---------- | :-------------------------------------- |
| **Auth**     | `/auth`     | Authentication routes (register, login) |
| **Incomes**  | `/incomes`  | Manage income records                   |
| **Expenses** | `/expenses` | Manage expense records                  |

## 📂 Project Structure

```
src/
├── db/             # Database configuration and schema
├── features/       # Feature-based modules (Auth, Expenses, Incomes)
├── middlewares/    # Custom Express middlewares (Error handling, etc.)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── index.ts        # Entry point
```

## 📄 License

This project is licensed under the ISC License.
