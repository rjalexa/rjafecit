# RJA Fecit

This project is a modern, production-ready web application built with a Next.js front-end and a FastAPI back-end. The front-end features a single, protected page that, after authentication via Clerk, allows users to fetch and display a list of random numbers from the back-end.

## Features

- **Front-end:** Next.js 14 with App Router, React 18, TypeScript, Tailwind CSS, and daisyUI.
- **Back-end:** FastAPI with Python 3.12.
- **Authentication:** Clerk for user authentication.
- **Containerization:** Docker and Docker Compose for local development and production builds.
- **Development Tools:** ESLint, Prettier, Husky, lint-staged, Vitest, React Testing Library, and k6 for load testing.
- **CI/CD:** GitHub Actions for continuous integration and release management.

## Architecture

### High-Level Architecture

```mermaid
graph TD
    subgraph Browser
        A[Client-side JavaScript]
    end

    subgraph "Next.js Container"
        B[Next.js Server]
        C[API Route: /api/v1/smorfia]
        E[Rewrite Engine]
    end

    subgraph "FastAPI Container"
        D[API Route: /api/v1/random]
    end

     subgraph "Smorfia definitions"
        F[/data/smorfia.json on filesystem]
    end

    A -- "fetch('/api/v1/smorfia')" --> B
    B -- "Handles internally" --> C
    C -- "Response" --> B
    B -- "Response" --> A

    A -- "fetch('/api/v1/random')" --> B
    B -- "Passes to Rewrite Engine" --> E
    C -- "Reads" --> F
    E -- "Proxies to FastAPI container" --> D
    D -- "Response" --> E
    E -- "Response" --> B
```

### Backend API

The application uses two different backend endpoints to provide data to the frontend:

-   **/api/v1/random**: This endpoint is proxied by the Next.js server to the FastAPI backend service running in a separate Docker container. The Next.js `rewrites` configuration handles this proxying, which avoids CORS issues and keeps the frontend code clean, as it can call a relative path.

-   **/api/v1/smorfia**: This endpoint is a standard Next.js API route, served directly by the Next.js server. It reads the `smorfia_napoletana.json` file from the `data` directory and returns its contents to the frontend.

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Next.js Frontend
    participant Clerk

    User->>Next.js Frontend: Accesses protected page
    Next.js Frontend->>Clerk: Redirects to login
    User->>Clerk: Enters credentials
    Clerk-->>Next.js Frontend: Returns with JWT
    Next.js Frontend->>User: Renders protected page
    User->>Next.js Frontend: Clicks "Get Random"
    Next.js Frontend->>Next.js Frontend: Fetches random numbers
    Next.js Frontend->>User: Displays numbers
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

This project requires two separate environment files for local development and Docker-based development.

#### Local Development (`.env.local`)

For running the application locally with `pnpm`, create a `.env.local` file by copying the example:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Clerk credentials and ensure the backend API URL is set to `http://localhost:8080`:

```dotenv
# .env.local

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API Configuration
NEXT_PUBLIC_BACKEND_API_BASE=http://localhost:8080

# Port Configuration
PORT=3000
```

#### Docker Development (`.env.docker`)

For running the application with Docker, create a `.env.docker` file:

```bash
cp .env.example .env.docker
```

Update `.env.docker` with your Clerk credentials. The backend API URL must be set to `http://backend:8080` to allow the front-end container to communicate with the back-end container:

```dotenv
# .env.docker

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API Configuration
NEXT_PUBLIC_BACKEND_API_BASE=http://backend:8080

# Port Configuration
PORT=3000
```

**To get your Clerk credentials:**
1. Log in to https://dashboard.clerk.com → select your app.
2. Open API Keys in the left-hand navigation.

### Installation and Running

#### Local Development (pnpm)

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run the development server:**
    This will start the Next.js front-end and the FastAPI back-end concurrently.
    ```bash
    pnpm dev
    ```

    The application will be available at `http://localhost:3000`.

#### Docker

1.  **Build and run the Docker containers:**
    ```bash
    ./docker/buildrun.sh
    ```

    The application will be available at `http://localhost:3000`.

## Backend Development

The FastAPI backend includes automatically generated documentation via Swagger UI. To access it, run the backend server and navigate to `http://localhost:8000/docs`.

```bash
pnpm dev:backend
```

## Scripts

- `pnpm dev`: Starts the Next.js development server.
- `pnpm dev:backend`: Starts the FastAPI backend server.
- `pnpm dev:all`: Starts both the Next.js and FastAPI servers concurrently.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Lints the codebase.
- `pnpm test`: Runs unit and integration tests.
- `pnpm test:e2e`: Runs end-to-end tests.
- `pnpm load-test`: Runs a load test with k6.
- `pnpm prepare`: Sets up Husky for pre-commit hooks.
