# ChatApp — Frontend

Small React + Socket.IO frontend for testing and interacting with a socket server.

## Overview

This is the frontend client used to demo socket events and simple room messaging. It uses Vite-style env vars (import.meta.env) and connects to a backend Socket.IO server defined by `VITE_BACKEND_URL`.

## Prerequisites

- Node.js 16+ (recommended 18+)
- npm or yarn
- Running backend Socket.IO server (see `VITE_BACKEND_URL` below)

## Install & Run

Open PowerShell or Command Prompt and run:

```powershell
cd d:\ChatApp\frontend
npm install
# start dev server
npm run dev   # or: npm start (depending on package.json)
```

## Environment

Create an `.env` file at `d:\ChatApp\frontend\.env` (or use `.env.local`) and set:

```
VITE_BACKEND_URL=http://localhost:3000
```

Notes:
- Vite requires env variables to be prefixed with `VITE_`. Change the URL to your backend socket server address and restart the dev server.

## Features

- Connects to backend Socket.IO server.
- Displays connection status and current socket id.
- Send messages (optionally include a room or a target socket id).
- Join rooms.
- Auto-scrolls message list.
- Quick actions: insert a test message, clear chat.

## Socket events used

Outgoing (emitted by client):
- `message` — payload: { message, id?, room? }
- `greet` — payload: { message, id? }
- `bye` — payload: string
- `join-room` — payload: roomName

Incoming (listened by client):
- `connect` / `disconnect`
- `message`
- `greet`
- `bye`
- `room-joined`

Adjust backend handlers to match these event names/payloads.

## Troubleshooting

- No connection / blank Socket ID:
  - Verify `VITE_BACKEND_URL` value and that the backend is running and reachable.
  - Check browser console for CORS or connection errors.
- Env changes not applied:
  - Restart the Vite dev server after editing `.env`.
- Messages not delivered:
  - Confirm backend listens for the same event names and expected payload shapes.

## Development notes

- The UI is implemented in `src/App.jsx`.
- Messages are stored in component state for demo purposes — not persisted.
- Easy to extend: add message timestamps, user names, or persist to a backend store.

## License
