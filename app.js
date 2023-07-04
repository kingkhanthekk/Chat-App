const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//Join page
app.get("/", (req, res) => {
  res.render("index");
});

//Chat app page
app.get("/chat", (req, res) => {
  res.render("chat");
});

io.on("connection", (socket) => {
  console.log("WebSocket Server");

  socket.emit("message", generateMessage("Welcome!"));
  socket.broadcast.emit(
    "message",
    generateMessage("A new user has joined the chat!")
  );

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message))
      return callback("Bad words are not allowed!");

    io.emit("message", generateMessage(message));

    callback();
  });

  socket.on("shareLocation", (location, callback) => {
    io.emit(
      "locationMessage",
      generateMessage(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );

    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left the chat!"));
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server running on port " + port);
});
