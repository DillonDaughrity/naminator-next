# 🤖 The Naminator

An AI-powered name combination generator built with Next.js, Auth.js, Prisma, and the Anthropic Claude API.

Enter two names, and Claude will generate creative combinations with "goodness" scores rating how appealing each combination sounds.

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Next.js 16 (App Router)                 |
| Language       | TypeScript                              |
| Authentication | Auth.js v5 (NextAuth) + Google OAuth    |
| Database       | PostgreSQL (Neon)                       |
| ORM            | Prisma 6                                |
| AI             | Anthropic Claude API (claude-sonnet-4-20250514) |
| Styling        | Tailwind CSS 4                          |

## Project Structure

```
naminator/
├── prisma/
│   └── schema.prisma          # Database schema (Auth.js + app models)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # Auth.js route handler
│   │   │   └── name-combinations/route.ts    # POST & GET endpoints
│   │   ├── login/page.tsx     # Login page with Google OAuth
│   │   ├── globals.css        # Tailwind imports
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page (server component)
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation bar with auth
│   │   ├── NameForm.tsx       # Name input form (client component)
│   │   └── ResultCard.tsx     # Individual result card display
│   ├── lib/
│   │   ├── anthropic.ts       # Claude API client & name generation
│   │   └── prisma.ts          # Prisma client singleton
│   ├── types/
│   │   └── next-auth.d.ts     # Auth.js type extensions
│   ├── auth.ts                # Auth.js configuration
│   └── middleware.ts          # Route protection middleware
├── .env.example               # Environment variable template
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- A **Neon** account (free tier): [neon.tech](https://neon.tech)
- A **Google Cloud** project with OAuth credentials
- An **Anthropic** API key: [console.anthropic.com](https://console.anthropic.com)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd naminator
npm install
```

### 2. Create Environment File

```bash
cp .env.example .env
```

Then edit `.env` and fill in all values (see below for each service).

### 3. Set Up Neon PostgreSQL

1. Go to [neon.tech](https://neon.tech) and sign up (free).
2. Create a new project.
3. Copy the connection string from the dashboard.
4. Paste it as `DATABASE_URL` in your `.env` file.

### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Go to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth client ID**.
5. Choose **Web application**.
6. Add an **Authorized redirect URI**: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** into your `.env`:
   - `AUTH_GOOGLE_ID` = Client ID
   - `AUTH_GOOGLE_SECRET` = Client Secret

### 5. Generate Auth Secret

```bash
openssl rand -base64 32
```

Paste the output as `AUTH_SECRET` in your `.env`.

### 6. Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com).
2. Create an API key.
3. Paste it as `ANTHROPIC_API_KEY` in your `.env`.

### 7. Push Database Schema

```bash
npx prisma db push
```

This creates all the tables in your Neon database.

### 8. Generate Prisma Client

```bash
npx prisma generate
```

### 9. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login page.

## API Endpoints

### `POST /api/name-combinations`

Generate new name combinations.

**Request:**
```json
{
  "name1": "John",
  "name2": "Jacob"
}
```

**Response:**
```json
{
  "id": 1,
  "name1": "John",
  "name2": "Jacob",
  "createdAt": "2025-02-16T12:00:00.000Z",
  "results": [
    { "id": 1, "name": "Jocob", "goodness": 4.2 },
    { "id": 2, "name": "Jacohn", "goodness": 3.8 },
    { "id": 3, "name": "JohnJacob", "goodness": 2.5 }
  ]
}
```

### `GET /api/name-combinations`

Retrieve all previously generated combinations for the authenticated user.

**Response:** An array of combination sets (same structure as POST response).

## Database Schema

```
NameCombinationSet          GeneratedName
┌──────────────────┐        ┌──────────────────┐
│ id (PK)          │───┐    │ id (PK)          │
│ name1            │   │    │ name             │
│ name2            │   └───>│ goodness         │
│ createdAt        │        │ setId (FK)       │
│ userId (FK)      │        └──────────────────┘
└──────────────────┘
```

## Helpful Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server                 |
| `npm run build`      | Build for production                     |
| `npm run db:push`    | Push schema to database (no migrations)  |
| `npm run db:migrate` | Create and apply a migration             |
| `npm run db:studio`  | Open Prisma Studio (visual DB browser)   |

## Troubleshooting

- **"NEXT_REDIRECT" error**: This is normal — Auth.js uses Next.js redirects internally. It's not a bug.
- **Google OAuth not working**: Make sure your redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- **Database connection error**: Verify your `DATABASE_URL` includes `?sslmode=require` for Neon.
- **Prisma client not found**: Run `npx prisma generate` after installing dependencies.

