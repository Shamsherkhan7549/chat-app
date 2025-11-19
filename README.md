# ChatApp — Frontend

Small React + Socket.IO frontend for testing and interacting with a socket server.

## Overview

This is the frontend client used to demo socket events and simple room messaging. It uses Vite-style env vars (import.meta.env) and connects to a backend Socket.IO server defined by `VITE_BACKEND_URL`. The main UI file is `frontend/src/App.jsx`.

## Prerequisites

- Node.js 16+ (recommended 18+)
- npm or yarn
- Running backend Socket.IO server (see `VITE_BACKEND_URL`)

## Dependencies

Example dependencies (install via package.json):

- react: ^18.2.0
- react-dom: ^18.2.0
- vite: ^5.0.0
- socket.io-client: ^4.7.0
- (optional) @vitejs/plugin-react: ^4.0.0

Install with:
```powershell
cd d:\ChatApp\frontend
npm install
# or
yarn
```

## Install & Run

```powershell
cd d:\ChatApp\frontend
npm install
npm run dev   # or: npm start (depending on package.json)
```

If using yarn:
```powershell
yarn
yarn dev
```

## Sample environment variables

Create `d:\ChatApp\frontend\.env` (or `.env.local`) with:

```
VITE_BACKEND_URL=http://localhost:3000
# Optional examples:
# VITE_BACKEND_PATH=/socket.io
# VITE_BACKEND_WS=true
```

Note: Vite only exposes variables prefixed with VITE_. Restart dev server after edits.

## Features

- Connects to backend Socket.IO server.
- Shows connection status and socket id.
- Send messages (optionally include room or target socket id).
- Join rooms and receive room join notifications.
- Auto-scroll message list.
- Quick UI actions (insert test message / clear chat).

## Socket events used

Outgoing (client emits):
- `message` — payload: { message, id?, room? }
- `greet` — payload: { message, id? }
- `bye` — payload: string
- `join-room` — payload: roomName

Incoming (client listens):
- `connect` / `disconnect`
- `message`
- `greet`
- `bye`
- `room-joined`

Ensure backend handlers match these event names/payloads.

## Troubleshooting

- Blank Socket ID / no connection:
  - Verify `VITE_BACKEND_URL` and that backend is running and reachable.
  - Check browser console for CORS or connection errors.
- Env changes not applied:
  - Restart the Vite dev server.
- Messages not received:
  - Confirm backend uses same event names and payload shapes.

## Development notes

- Main UI file: `frontend/src/App.jsx`
- Messages are stored in React state for demo only (not persisted).
- Easy to extend: add timestamps, usernames, persistence, or auth.

## License

MIT
