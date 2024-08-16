const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const profilesRouter = require("./src/Routes/router");


app.use(morgan("dev"));

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
// for parsing application/xwww-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Request-With,context-Type,Accept,Authorization,appKey"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  //Allow following headers for WEB Options calls
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    return res.status(200).json({});
  }
  next();
});

app.use(profilesRouter);
// console.log("Connected!")

app.use((req, res, next) => {
  const error = new Error("NOT Found!");

  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: false,
      message: error.message,
    },
  });
});

module.exports = app;
