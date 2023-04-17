// Import express / Assign it to variable 'app' for convenience / Set default port
const express = require("express");
const app = express();
const PORT = 8080;

// List of URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


//Setup response for home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Setup response for /urls.json path
app.get("/urls.json", (req, res) => {
  //respond by sending JSON formatted urlDatabase
  res.json(urlDatabase);
});

//Setup response for /hello path
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// //Setup /set and /fetch path tests
// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });

//Setup listener for requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});