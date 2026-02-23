# Hospital Dashboard Backend

NestJS backend for hospital management system with Prisma ORM and PostgreSQL.

## Prerequisites

- Node.js (v22 or higher)
- PostgreSQL (v14 or higher)
- npm package manager

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nitt-hospital-dashboard/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory

   > **Note:** Replace `<user>` and `<password>` with your PostgreSQL credentials.

## Database Setup

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```
   This generates the Prisma Client based on your schema.

2. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```
   This applies all pending migrations to your database.

## Running the Application

### Development Mode
```bash
npm run start:dev
```
The server will start with hot-reload enabled.



