const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ─── In-memory store ────────────────────────────────────────────────────────
const rooms = new Map();
const MAX_POSTS = 50;

// ─── Rate limiting ───────────────────────────────────────────────────────────
// Per-socket: max 20 posts per 10 seconds
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 10_000;
const rateLimits = new Map(); // socketId -> { count, resetAt }

function isRateLimited(socketId) {
  const now = Date.now();
  const entry = rateLimits.get(socketId);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(socketId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// ─── Input sanitization ──────────────────────────────────────────────────────
const VALID_CODE_RE = /^[A-Z2-9]{4,12}$/;
const VALID_LANGUAGES = new Set([
  "javascript","typescript","python","java","cpp",
  "html","css","json","bash","rust","go","sql",
]);

function sanitizeString(val, maxLen) {
  if (typeof val !== "string") return "";
  return val.slice(0, maxLen).replace(/\0/g, "");
}

function isValidCode(code) {
  return typeof code === "string" && VALID_CODE_RE.test(code);
}

// ─── Room helpers ────────────────────────────────────────────────────────────
function getRoom(code) {
  if (!rooms.has(code)) {
    rooms.set(code, { posts: [], users: new Map() });
  }
  return rooms.get(code);
}

function roomExists(code) {
  return rooms.has(code) && rooms.get(code).users.size > 0;
}

// ─── Server ──────────────────────────────────────────────────────────────────
app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // Health check endpoint for uptime monitoring
    if (parsedUrl.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
      return;
    }

    handle(req, res, parsedUrl);
  });

  const allowedOrigins = process.env.NEXT_PUBLIC_SOCKET_URL
    ? [process.env.NEXT_PUBLIC_SOCKET_URL]
    : ["http://localhost:3000"];

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? "*" : allowedOrigins,
      methods: ["GET", "POST"],
    },
    // Limit incoming message size to 64 KB
    maxHttpBufferSize: 64 * 1024,
  });

  io.on("connection", (socket) => {
    let currentRoom = null;
    let currentUsername = null;

    // ── join_room ────────────────────────────────────────────────────────────
    socket.on("join_room", ({ code, username, create }) => {
      // Validate room code
      const safeCode = sanitizeString(code, 12).toUpperCase();
      if (!isValidCode(safeCode)) {
        socket.emit("room_not_found");
        return;
      }

      // Validate username
      const safeName = sanitizeString(username, 20).trim();
      if (!safeName) return;

      const exists = roomExists(safeCode);

      // Prevent joining a non-existent room (unless creating)
      if (!create && !exists) {
        socket.emit("room_not_found");
        return;
      }

      // Prevent duplicate joins on the same socket
      if (currentRoom) return;

      currentRoom = safeCode;
      currentUsername = safeName;

      socket.join(safeCode);
      const room = getRoom(safeCode);
      room.users.set(socket.id, safeName);

      socket.emit("room_history", room.posts);

      const userList = Array.from(room.users.values());
      io.to(safeCode).emit("room_user_count", room.users.size);
      io.to(safeCode).emit("room_users", userList);
      socket.to(safeCode).emit("user_joined", { username: safeName });
    });

    // ── post_snippet ─────────────────────────────────────────────────────────
    socket.on("post_snippet", ({ code, content, language, type, username }) => {
      // Must be in a room
      if (!currentRoom) return;

      // Rate limit
      if (isRateLimited(socket.id)) {
        socket.emit("rate_limited", { message: "Slow down — too many posts." });
        return;
      }

      // Validate room code matches current room
      const safeCode = sanitizeString(code, 12).toUpperCase();
      if (safeCode !== currentRoom) return;

      // Validate content
      const safeContent = sanitizeString(content, 50_000);
      if (!safeContent.trim()) return;

      // Validate type
      const safeType = type === "text" ? "text" : "code";

      // Validate language
      const safeLang = safeType === "code" && VALID_LANGUAGES.has(language)
        ? language
        : null;

      // Validate username matches session (prevent spoofing)
      const safeUsername = currentUsername;

      const room = getRoom(safeCode);
      const post = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        content: safeContent,
        language: safeLang,
        type: safeType,
        username: safeUsername,
        timestamp: new Date().toISOString(),
      };

      room.posts.push(post);
      if (room.posts.length > MAX_POSTS) {
        room.posts.shift();
      }

      io.to(safeCode).emit("receive_snippet", post);
    });

    // ── leave_room / disconnect ───────────────────────────────────────────────
    socket.on("leave_room", () => handleLeave());
    socket.on("disconnect", () => {
      rateLimits.delete(socket.id);
      handleLeave();
    });

    function handleLeave() {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      if (room) {
        room.users.delete(socket.id);
        const userList = Array.from(room.users.values());
        io.to(currentRoom).emit("room_user_count", room.users.size);
        io.to(currentRoom).emit("room_users", userList);
        if (currentUsername) {
          socket.to(currentRoom).emit("user_left", { username: currentUsername });
        }
        if (room.users.size === 0) {
          rooms.delete(currentRoom);
        }
      }
      socket.leave(currentRoom);
      currentRoom = null;
      currentUsername = null;
    }
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
