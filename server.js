var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const http = require("http").Server(app);
const io = require("socket.io")(http);

const indexRouter = require("./routes/index.js");
const learnRouter = require("./routes/learn.js");
const downloadRouter = require("./routes/download.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/learn", learnRouter);
app.use("/download", downloadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  res.render("404.ejs");
});

const users = new Map();
// banned word
const bannedWords = ["connard", "asshole", "merde"];

// Function for replace banned word
function censurMessage(message) {
  let censuredMessage = message;
  bannedWords.forEach((word) => {
    const regexp = new RegExp(word, "gi");
    censuredMessage = censuredMessage.replace(regexp, "#".repeat(word.length));
  });
  return censuredMessage;
}
// Listen to socket.io
io.on("connection", (socket) => {
  socket.on("pseudo", (pseudo) => {
    users.set(socket.id, pseudo);
  });

  // message alert user login 
  socket.on('pseudo', (pseudo) => {
    socket.pseudo = pseudo;
    socket.emit('login', `You are connected as ${pseudo}`);
    socket.broadcast.emit('login', `${pseudo} is connected`);
  });

  // Listen user message
  socket.on("chat message", (msg) => {
    const pseudo = users.get(socket.id);
    msg.text = censurMessage(msg.text);
    msg.date =
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds();
    io.emit("chat message", {
      pseudo: pseudo,
      text: msg.text,
      date: msg.date,
    });
  });

  //Listen user login
  socket.on("login", (username) => {
    users[socket.id] = username;
    io.emit("message", `The user ${username} joined the chat`);
  });

  // Listen user logout
  socket.on("disconnect", () => {
    console.log("An user is deconnected");
  });
});

http.listen(8080, () => console.log(`Listening on port 8080`));

module.exports = app;
