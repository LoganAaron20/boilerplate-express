let express = require("express");
let app = express();
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");

// Logs the request method, request path, and the request id for all http requests made;
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Loads the static css file for the application
app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

/*
    Will respond with a json object containing the req.params input;
    * req.params is an object containing the request parameters in the request url
    * ex. req.params = { word: (req.param.word)}
    * const { word } = req.params destructures the word parameter from the req.params object;
*/
app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({ echo: word });
});

/* Involves the env variable. If MESSAGE_STYLE = uppercase,
    the response is sent back as a json object in uppercase font
    if not uppercase, the response is sent as a json object in lowercase!
*/
app.get("/json", (req, res) => {
  const uppercase = process.env.MESSAGE_STYLE;
  //   const messageObject = { message: "Hello json" };
  if (process.env.MESSAGE_STYLE == "uppercase") {
    res.json({ message: "HELLO JSON" });
  } else {
    res.json({ message: "Hello json" });
  }
});

/*
    Chaining middleware functions:
    * Sets a new time on the req.time object
    * Then calls next(), calling the next middleware function
    * Then a json response is sent back with the req.time, set to the new Date object
*/
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  function (req, res) {
    res.json({ time: req.time });
  }
);

/*
  Query strings are another way to get input from the client
    * Query strings are delimited by a question mark(?)
    * includes field=value couples
    * each couple is seperated by an ampersand(&);
    * ex. /library?userId=546&bookId=6754 / req.query = { userId: '546', bookId: '6754' };
*/
app.get("/name", (req, res) => {
  const { first, last } = req.query;
  res.json({ name: `${first} ${last}` });
});

app.post("/name", (req, res) => {
  res.json({ name: `${req.body.first} ${req.body.last}` });
});

/*
  Sending a file as a response made to a request to "/"(root directory):
  Will send the file 'index.html' in the 'views' folder;
  * __dirname get the absolute path to the current root directory;
*/
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;
