const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// In-memory store: roomCode -> { posts: [], users: Set }
const rooms = new Map();

const MAX_POSTS = 50;

function getRoom(code) {
  if (!rooms.has(code)) {
    rooms.set(code, { posts: [], users: new Map() });
  }
  return rooms.get(code);
}

function roomExists(code) {
  return rooms.has(code) && rooms.get(code).users.size > 0;
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    let currentRoom = null;
    let currentUsername = null;

    socket.on("join_room", ({ code, username }) => {
      const isNew = !roomExists(code);

      currentRoom = code;
      currentUsername = username;

      socket.join(code);
      const room = getRoom(code);
      room.users.set(socket.id, username);

      // If this is a brand-new room with no history, tell the joiner
      if (isNew && room.posts.length === 0) {
        socket.emit("room_not_found");
      }

      // Send existing posts to the new joiner
      socket.emit("room_history", room.posts);

      // Broadcast updated user count + user list + join event
      const userList = Array.from(room.users.values());
      io.to(code).emit("room_user_count", room.users.size);
      io.to(code).emit("room_users", userList);
      socket.to(code).emit("user_joined", { username });
    });

    socket.on("post_snippet", ({ code, content, language, type, username }) => {
      const room = getRoom(code);
      const post = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        content,
        language: language || null,
        type, // "code" | "text"
        username,
        timestamp: new Date().toISOString(),
      };

      room.posts.push(post);
      if (room.posts.length > MAX_POSTS) {
        room.posts.shift();
      }

      io.to(code).emit("receive_snippet", post);
    });

    socket.on("leave_room", () => {
      handleLeave();
    });

    socket.on("disconnect", () => {
      handleLeave();
    });

    function handleLeave() {
      if (currentRoom) {
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
    }
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
