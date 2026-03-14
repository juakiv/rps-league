# rps-league

RPS League is an app that displays rock-paper-scissors match results and leaderboards. It utilizes the [Bad API](https://assignments.reaktor.com/) as a data source.

## Installation
1. Clone the repository.
```
git clone git@github.com:juakiv/rps-league.git
```
2. Install dependencies on both frontend and backend. You can do this either by running `npm install` in both directories or you can run `npm run install-apps` in the project root.
3. Set up environment variables. Both backend and frontend directories have an `.env.example` file that you can rename to `.env`. It should be enough to set your API key in backend environment variables.
4. Migrate the database by running `npm run db-push --workspace=backend`.
5. Run the app with `npm run dev` in project root. This will start both backend and frontend.

You can also build the app by running `npm run build` in both frontend and backend, or in the project root. Then you can run the built application by running `npm run start` in project root.

## Project structure
This project is organized as a monorepo containing both the frontend and backend applications in a single repository.

```
root/
├─ frontend/   # Vite + React + TypeScript client application
└─ backend/    # Express.js server and API
```

### `frontend/`

The frontend directory contains the client-side application built with Vite, React, and TypeScript.
It is responsible for the user interface and communicates with the backend API for data.

### `backend/`

The backend directory contains the Express.js server that exposes the application's API.

Key technologies used:
- Express.js for routing and HTTP handling
- Drizzle ORM for database interactions
- SQLite as the database

## API docs
- `/api/matches` -> returns all matches in descending order (date)
- `/api/leaderboard` -> returns a leaderboard of players with most wins
- `/api/players?name=[playerName]` -> returns all matches that a player has been part of. Name is mandatory.

All endpoints also support pagination through `page` and `pageSize` query parameters. They default to page 1 and size of 20. All endpoints also support filtering by date through `startDate` and `endDate` query parameters.