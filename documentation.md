# Financial Transaction Data App

Welcome to the **Financial Transaction Data App**—a simple **CRUD** application to manage transaction records with a full-stack setup (**React + Node/Express + PostgreSQL**). This README explains the **technical decisions**, **technology stack**, **performance**, **accessibility**, and **SEO** considerations, and provides instructions on how to run the project locally.

---

## Table of Contents

1.  [Overview](#overview)
2.  [Tech Stack & Decisions](#tech-stack--decisions)
3.  [Folder Structure](#folder-structure)
4.  [How to Run Locally](#how-to-run-locally)
5.  [Environment Variables](#environment-variables)
6.  [Performance Considerations](#performance-considerations)
7.  [Accessibility Considerations](#accessibility-considerations)
8.  [SEO Considerations](#seo-considerations)

---

## Overview

This application allows you to **Create**, **Retrieve**, **Update**, and **Delete** financial transactions. Each transaction has:

- **Transaction ID** (`transaction_id` in DB / `transactionId` in frontend)
- **Title**
- **Description**
- **Amount** (in cents)
- **From Account**
- **To Account**
- **Transaction Date**

### Key Features

- **RESTful API** built with Node, Express, and TypeScript.
- **Frontend** built with React, TypeScript, and Tailwind CSS.
- **Persistent** data storage using PostgreSQL.
- **CRUD** operations demonstrated on client and server sides.
- Simple form validations and user feedback on success/failure.

---

## Tech Stack & Decisions

### 1\. Frontend

- **React**: Well-known, efficient library for building user interfaces.
- **TypeScript**: Adds static typing to JavaScript, improving maintainability and reducing bugs.
- **Tailwind CSS**: Utility-first CSS framework, quick to integrate and easily customizable.

**Why React + Tailwind?**

- React fosters reusable UI components.
- Tailwind offers fast styling without leaving JSX/TSX. Minimal custom CSS needed.

### 2\. Backend

- **Node.js / Express**: Straightforward to set up RESTful endpoints.
- **TypeScript**: For type safety and better developer tooling.
- **pg (node-postgres)**: Native PostgreSQL client for Node.

**Why Node + Express?**

- Lightweight, simple, and widely used.
- Great community support and a mature ecosystem.
- Integrates well with TypeScript and PostgreSQL.

### 3\. Database

- **PostgreSQL**: A robust, open-source relational database.
- Chosen for its reliability, ACID compliance, and strong community.

### 4\. Decisions & Rationale

- **Separate Repositories or Folders?**
  Kept **frontend** and **backend** in separate folders within a single repo for clarity.
- **UUID vs. Numeric ID?**
  - The app uses a **UUID** (`transaction_id`) for primary reference, more unique than a numeric ID and avoids revealing sequential data.
  - Internally, the DB has both `id` (SERIAL PRIMARY KEY) and `transaction_id` (VARCHAR/UUID). The CRUD logic uses `transaction_id` for lookups.

---

## Folder Structure

- **backend/src/index.ts**: Entry point for the Node server.
- **backend/src/db.ts**: Database connection configuration.
- **backend/src/routes/transactionRoutes.ts**: CRUD endpoints for transactions.
- **frontend/src/components**: React components for listing, creating, and editing transactions.

---

## How to Run Locally (Using Restore Terminals VSCode Extension)

1. Download the [extension](https://marketplace.visualstudio.com/items?itemName=EthanSK.restore-terminals)
2. Open the commands palette and run "Restore Terminals"
3. It will open 3 splited terminals with the backend, the frontend, and the db

## How to Run Locally

### 1\. Clone the Repo

`git clone https://github.com/YourUser/my-transaction-app.git && cd my-transaction-app`

### 2\. Set Up the Database

1.  Ensure you have **PostgreSQL** installed (e.g., Homebrew on macOS).
2.  Create a database and table:

```
CREATE DATABASE my_transaction_db;
\c my_transaction_db;

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount INT NOT NULL,
    from_account VARCHAR(255) NOT NULL,
    to_account VARCHAR(255) NOT NULL,
    transaction_date VARCHAR(50) NOT NULL
);
```

3.  Create a user or use the default superuser:

```
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE my_transaction_db TO myuser;
```

### 3\. Configure Environment Variables

In `backend/.env`:

```
PORT=4000
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/my_transaction_db
```

Install dependencies and run the server:

`cd backend && npm install && npm run dev`

You should see `Server listening on port 4000` in your terminal.

### 4\. Run the Frontend

In a **new** terminal:

`cd frontend && npm install && npm run dev`

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5\. Test the Endpoints

- **Create** a transaction via the UI or using a tool like Postman:

  - **POST** `http://localhost:4000/api/transactions` with JSON body:

```
{
  "title": "Test",
  "description": "Sample transaction",
  "amount": 2000,
  "fromAccount": "AccountA",
  "toAccount": "AccountB",
  "transactionDate": "2025-01-01"
}
```

- **List** all transactions:
  - **GET** `http://localhost:4000/api/transactions`

---

## Environment Variables

- **PORT**: The port on which Express listens (default 4000).
- **DATABASE_URL**: Connection string for PostgreSQL, e.g. `postgresql://myuser:mypassword@localhost:5432/my_transaction_db`.

Ensure you load these via a `.env` file at the root of your backend. For security, **never** commit real credentials to a public repo.

---

## Performance Considerations

1.  **Client-Side**
    - React with minimal overhead for a small CRUD app.
    - Could implement code splitting if many routes/components.
    - Could add React Query or SWR for caching.
2.  **Server-Side**
    - Express is lightweight; consider NestJS or advanced caching if scaling.
    - Connection pooling via `pg.Pool` for efficient DB connections.
3.  **Database**
    - Index on `transaction_id` for fast lookups.
    - For large-scale usage, consider indexing `transaction_date` if heavily queried.

---

## Accessibility Considerations

- **Form Labels**: Each input has a `<label>` for screen readers.
- **Semantic HTML**: A `<table>` is used for transaction listings, improving screen reader parsing.
- **Focus Management**: The modal (`TransactionModal.tsx`) is a fixed overlay; consider trapping focus inside it.
- **Color Contrast**: Tailwind defaults are decent, but can be refined.

---

## SEO Considerations

- **Single-Page App**: Standard React approach. For more advanced SEO, consider Next.js/SSR.
- **Page Titles & Metadata**: Currently just a single `<title>` in `index.html`. Could dynamically update `<title>` and `<meta>` or use SSR.
- **Accessible Routing**: Currently minimal. For robust SEO, might use SSR or server-side routing.
