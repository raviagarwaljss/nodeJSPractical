const express = require("express");
const dotenv = require('dotenv');
const route = require("./Routes/routing");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/",route);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });