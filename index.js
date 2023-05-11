const db = require("./models");
const express = require("express");
const cors = require("cors");
const app = express();

const port = 2000;
app.use(express.json());
db.sequelize.sync({ alter: false });
app.use(cors());
app.listen(port, () => console.log(`Server is running at port ${port}`));
