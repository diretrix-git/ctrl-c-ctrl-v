# CodeShare

Real-time code + text sharing. No accounts. Just a room code.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Railway (free tier)

Railway is the best free option for Socket.io apps because it supports persistent WebSocket connections and long-running Node processes.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "init"
gh repo create codeshare --public --push
# or push to an existing repo
```

### Step 2 — Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your repository
4. Railway auto-detects Node.js and will use `npm run start` (which runs `node server.js`)

### Step 3 — Set environment variables

In Railway dashboard → your service → **Variables**, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` (Railway sets this automatically, but you can confirm) |

### Step 4 — Set the start command

Railway should auto-detect it from `package.json` `"start"` script. If not, go to **Settings → Deploy → Start Command** and set:

```
node server.js
```

### Step 5 — Deploy

Railway deploys automatically on every push to your main branch. Watch the build logs — it runs `npm install` then `node server.js`.

### Step 6 — Get your URL

Railway gives you a public URL like `https://codeshare-production.up.railway.app`. 

Set `NEXT_PUBLIC_SOCKET_URL` in Railway Variables to this URL so the Socket.io client connects to the right host in production:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-app.up.railway.app` |

Then redeploy (push a commit or click **Redeploy** in Railway).

### Done

Your app is live. Share the URL, create a room, and start posting.

---

## How it works

- `server.js` — custom Node HTTP server that boots Next.js + Socket.io on the same port
- No database — posts live in memory, max 50 per room, cleared when the room empties
- Rooms are identified by a 6-character code (nanoid)
- Shiki handles syntax highlighting client-side (no server round-trip)
