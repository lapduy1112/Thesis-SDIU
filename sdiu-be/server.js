const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());
const http = require("http");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./connection");
const server = http.createServer(app);
const { Server } = require("socket.io");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const newsRoutes = require("./routes/newsRoutes");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");
const conversationRoute = require("./routes/conversationRoutes");
const messageRoute = require("./routes/messageRoutes");
const reportRoute = require("./routes/reportRoutes");
const notifyRoute = require("./routes/notifyRoutes");
const checkAuthRoutes = require("./routes/checkAuthRoutes");

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   })
// );

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.set("socketio", io);
let users = [];
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });
  socket.on(
    "sendMessage",
    async ({ receiverId, senderId, text, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await User.findById(senderId);
      if (receiver) {
        io.to(receiver.socketId).emit("receiveMessage", {
          senderId,
          text,
          conversationId,
          receiverId,
          user: { id: user._id, name: user.name, email: user.email },
        });
      } else {
        io.to(sender.socketId).emit("receiveMessage", {
          senderId,
          text,
          conversationId,
          receiverId,
          user: { id: user._id, name: user.name, email: user.email },
        });
      }
    }
  );
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(checktoken)
app.use("/auth", authRoutes);
app.use("/authadmin", authAdminRoutes);
app.use("/checkauth", checkAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/news", newsRoutes);
app.use("/uploadcloudinary", cloudinaryRoutes);
app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);
app.use("/notify", notifyRoute);
app.use("/report", reportRoute);
// app.get("/test", (req, res, next) => {
//   res.status(200).json({ success: true });
// });

server.listen(8080, () => {
  console.log("server running at port", 8080);
});
