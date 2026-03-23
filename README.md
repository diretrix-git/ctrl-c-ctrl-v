# ctrl-c-ctrl-v

Real-time code and text sharing. No accounts. No database. Just a room code.

> Post a snippet, everyone in the room sees it instantly. Copy it and go.

**Live site:** [ctrl-c-ctrl-v.up.railway.app](https://ctrl-c-ctrl-v.up.railway.app)

## Features

- Create or join a room with a 6-character code
- Post code (with syntax highlighting) or plain text — live for everyone in the room
- One-click copy on every post — raw text, no formatting noise
- Username picker on join with avatar initials
- Share room link — copies the full URL to clipboard
- Syntax theme switcher — Vitesse, GitHub, Dracula, Nord, One Dark
- Line numbers on multi-line code blocks
- Compact mode for a denser feed
- Join/leave toast notifications
- Keyboard shortcut: `Ctrl+Enter` to send
- Fully mobile responsive
- No sign up, no persistence — posts vanish when the room empties

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Real-time | Socket.io via custom `server.js` |
| Syntax highlighting | Shiki (client-side) |
| State | Zustand |
| Room IDs | nanoid |

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Project structure

```
├── server.js               # Custom Node server — Next.js + Socket.io on one port
├── nixpacks.toml           # Railway build config
├── app/
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   ├── globals.css
│   ├── not-found.tsx
│   └── room/[code]/
│       └── page.tsx        # Room page
├── components/
│   ├── RoomHeader.tsx      # Header with code, share, theme, compact toggle
│   ├── PostCard.tsx        # Individual post with copy button
│   ├── InputPanel.tsx      # Code/text input with language selector
│   ├── UsernameModal.tsx   # Name picker shown on room join
│   └── Toast.tsx           # Join/leave notifications
├── lib/
│   ├── socket.ts           # Socket.io client singleton
│   ├── store.ts            # Zustand store
│   └── utils.ts
└── types/
    └── index.ts
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` / `Cmd+Enter` | Send post |
| `Enter` | Confirm username in modal |

## Deploy to Railway

Railway is the recommended platform — it supports persistent WebSocket connections and long-running Node processes on the free tier.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your repository
4. Railway uses `nixpacks.toml` to run `npm run build` then `node server.js` automatically

### Step 3 — Set environment variables

In Railway dashboard → your service → **Variables**:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-app.up.railway.app` |

> `PORT` is injected automatically by Railway — do not set it manually.

### Step 4 — Get your URL and redeploy

Railway gives you a public URL like `https://your-app.up.railway.app`.

Update `NEXT_PUBLIC_SOCKET_URL` to match that URL, then click **Redeploy** in the Railway dashboard (or push a new commit).

Your app is live.

## How it works

- `server.js` boots Next.js and Socket.io on the same HTTP server and port
- Rooms are in-memory only — no database, max 50 posts per room
- When the last user leaves, the room and all its posts are deleted
- Shiki highlights code client-side, cached per post ID + theme so switching themes re-highlights instantly
- Socket events: `join_room` `leave_room` `post_snippet` `receive_snippet` `room_user_count` `user_joined` `user_left`

## License

MIT
