const db = require("./models");
const express = require("express");
const cors = require("cors");
const app = express();

const port = 5000;
const {
  authRoutes,
  userRoutes,
  uploadRoutes,
  postRoutes,
  commentRoutes,
} = require("./Routes");

app.use(express.json());
db.sequelize.sync({ alter: false });
app.use(cors());
app.use(express.static("public"));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/album", uploadRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

app.listen(port, () => console.log(`Server is running at port ${port}`));
