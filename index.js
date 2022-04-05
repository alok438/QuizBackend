const express = require("express");
const app = express();
var cors = require("cors");
// var bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;

// all routes
var apiRoutes = require("./src/routes/api.js");
var teacherRoutes = require("./src/routes/teacher.js");
var studentRoutes = require("./src/routes/student.js");

// dependency
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

//database connection
const db = require("./src/database/db.js");
db();

// socket
var server = require("http").Server(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  socket.emit("test event", "Hey ");
});

// for testing purpose
app.get("/", (req, res) => {
  res.send("App runing");
});

//  all routes
app.use("/", apiRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
