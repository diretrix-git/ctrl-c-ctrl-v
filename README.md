# ctrl-c-ctrl-v

Real-time code and text sharing. No accounts. No database. Just a room code.

> Post a snippet, everyone in the room sees it instantly. Copy it and go.

**Live site:** [ctrl-c-ctrl-v.onrender.com](https://ctrl-c-ctrl-v.onrender.com)

## Features

- Create or join a room with a 6-character code
- Post code (with syntax highlighting) or plain text — live for everyone in the room
- One-click copy on every post — raw text, no formatting noise
- Username picker on join with avatar initials — persists across refreshes
- Online users panel — see who's currently in the room
- Share room link — copies the full URL to clipboard
- Syntax theme switcher — Vitesse, GitHub, Dracula, Nord, One Dark
- Line numbers on multi-line code blocks
- Compact mode for a denser feed
- Join/leave toast notifications
- Keyboard shortcut: `Ctrl+Enter` to send
- Friendly error state for invalid or expired room codes
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
├── render.yaml             # Render deployment config
├── app/
│   ├── layout.tsx          # Root layout with metadata and Google Analytics
│   ├── page.tsx            # Landing page
│   ├── globals.css
│   ├── not-found.tsx
│   ├── opengraph-image.tsx # Auto-generated OG image (1200×630)
│   ├── sitemap.ts          # Auto-generated sitemap.xml
│   ├── robots.ts           # Auto-generated robots.txt
│   └── room/[code]/
│       └── page.tsx        # Room page
├── components/
│   ├── RoomHeader.tsx      # Header with code, share, theme, compact toggle, users
│   ├── PostCard.tsx        # Individual post with copy button
│   ├── InputPanel.tsx      # Code/text input with language selector
│   ├── UsernameModal.tsx   # Name picker shown on room join
│   ├── Toast.tsx           # Join/leave notifications
│   └── GoogleAnalytics.tsx # GA4 script loader
├── lib/
│   ├── socket.ts           # Socket.io client singleton
│   ├── store.ts            # Zustand store
│   └── utils.ts
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
└── types/
    └── index.ts
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The `dev` script runs `node server.js` directly — this starts both Next.js and Socket.io on port 3000.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` / `Cmd+Enter` | Send post |
| `Enter` | Confirm username in modal |

## Deploy to Render

Render supports persistent WebSocket connections and long-running Node processes on the free tier.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "your message"
git push origin main
```

### Step 2 — Create a Render Web Service

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` — confirm the settings:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `node server.js`
   - **Environment:** Node

### Step 3 — Set environment variables

In Render dashboard → your service → **Environment**:

| Key | Value | Required |
|---|---|---|
| `NODE_ENV` | `production` | Yes |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-app.onrender.com` | Yes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Optional — Google Analytics |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | your Search Console token | Optional — SEO |

> `PORT` is injected automatically by Render — do not set it manually.

### Step 4 — Get your URL and redeploy

Render gives you a URL like `https://your-app.onrender.com`.

Update `NEXT_PUBLIC_SOCKET_URL` to match that URL, then trigger a redeploy (or push a new commit).

> **Note:** On Render's free tier, the service spins down after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up. Upgrade to a paid instance to avoid this.

Your app is live.

## How it works

- `server.js` boots Next.js and Socket.io on the same HTTP server and port
- Rooms are in-memory only — no database, max 50 posts per room
- Joining a code that doesn't exist shows a "Room not found" error — no ghost rooms are created
- When the last user leaves, the room and all its posts are deleted
- Shiki highlights code client-side, cached per post ID + theme so switching themes re-highlights instantly
- Usernames are saved in `localStorage` so returning users skip the name picker
- Socket events: `join_room` `leave_room` `post_snippet` `receive_snippet` `room_user_count` `room_users` `room_not_found` `user_joined` `user_left`

## License

MIT
