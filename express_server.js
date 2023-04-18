// Import express / Assign it to variable 'app' for convenience / Set default port
const express = require("express");
const app = express();
const PORT = 8080;



//<<<<<MIDDLEWARE>>>>>\\
//Set ejs as view engine
app.set("view engine", "ejs");
//Decode input from front end to be able to work with in back end using .urlencoded
app.use(express.urlencoded({ extended: true }));

// List of URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Function used to generate random ID for shortened URL
const generateRandomString = function() {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i <= 6; i++) {
    let charIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[charIndex];
  }
  return randomString;
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
  res.render("urls_index", templateVars);
});

//Response for /urls/new path
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});








//Handles post responses coming in from submission form (/urls/new path)
app.post("/urls", (req, res) => {
  let id = generateRandomString();  //Assign my random string output to id
  urlDatabase[id] = req.body.longURL;  //Add id and longURL propert to existing urlDatabase object
  res.redirect(`/urls/${id}`);  //Use res.redirect to redirect user to the new id in browser 
});

//Handles redirect to longURL when short URL is used
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});



app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
    res.render("urls_show", templateVars);
  });
  
    
    
    //Setup listener for requests
    app.listen(PORT, () => {
      console.log(`Vik's TinyURL app listening on port ${PORT}!`);
    });
