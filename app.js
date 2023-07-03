const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  console.log("WebSocket Server");

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined the chat!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("shareLocation", (location) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat!");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server running on port " + port);
});
