// Import express / Assign it to variable 'app' for convenience / Set default port
const express = require("express");
const app = express();
const PORT = 8080;

//Set ejs as view engine
app.set("view engine", "ejs");

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

//Response for /urls path >> set templateVars to urls obj, call res.render to render urls_index using templateVars
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

//Response for /urls/new path
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Implement .urlencoded method to parse the body received
app.use(express.urlencoded({ extended: true }));

//Handles post responses coming in from submission form (/urls/new path)
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});



//This code snippet is defining a route for an HTTP GET request on the path "/urls/:id". The ":id" part of the path is a parameter that will be dynamically replaced with a specific value when the request is made.

//When a client makes a GET request to this route, the function defined as the second argument (the callback function) will be executed. This function takes two arguments, req and res, which represent the request and response objects respectively.

//Inside the callback function, a JavaScript object templateVars is created, which contains two key-value pairs. The id key has a value of req.params.id, which corresponds to the dynamic value of the :id parameter in the URL path. The longURL key has a value of urlDatabase[req.params.id], which retrieves the long URL associated with the :id parameter from a database (presumably).

//Finally, the function calls the res.render() method to render a template called "urls_show", passing in templateVars as the second argument. This template will be dynamically populated with the id and longURL values from templateVars, and the resulting HTML will be sent as the response to the client's GET request.

//In this case, the route path is "/urls/:id", so any value that is included in the URL after "/urls/" will be extracted by Express as the id parameter and made available as req.params.id within the route handler function.

//When the templateVars object is passed to the res.render() method as the second argument, the id property is included in the object. The res.render() method then takes care of replacing the :id parameter in the route path with the value of templateVars.id before sending the rendered HTML as the response to the client's GET request.

//In other words, the id value from templateVars is automatically passed into the URL string by Express, based on the :id route parameter that was defined in the route path. No template literals are necessary because the dynamic value is inserted directly into the URL string by the Express framework.

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

//Setup listener for requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

