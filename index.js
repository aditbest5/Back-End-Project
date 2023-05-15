const db = require("./models");
const express = require("express");
const cors = require("cors");
const app = express();

const port = 2000;
const { authRoutes, userRoutes, uploadRoutes } = require("./Routes");

app.use(express.json());
db.sequelize.sync({ alter: false });
app.use(cors());
app.use(express.static("public"));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/album", uploadRoutes);

app.listen(port, () => console.log(`Server is running at port ${port}`));
