// Import express / Assign it to variable 'app' for convenience / Set default port
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;



//<<<<<MIDDLEWARE>>>>>\\
//Set ejs as view engine
app.set("view engine", "ejs");
//Decode input from front end to be able to work with in back end using .urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// List of URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


//List of registered users
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  admin: {
    id: "admin",
    email: "vik.ristic@gmail.com",
    password: "123test"
  }
};



//Function used to generate random ID for shortened URL
const generateRandomString = function() {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

//Setup response for /urls.json path ///DELETE AFTER DEVELOPMENT
app.get("/urls.json", (req, res) => {
  //respond by sending JSON formatted urlDatabase
  res.json(urlDatabase);
});

//Response for /urls path >> set templateVars to urls obj, call res.render to render urls_index using templateVars
app.get("/urls", (req, res) => {
  const currentUser = users[req.cookies["user"]];
  const templateVars = {
    urls: urlDatabase,
    currentUser
  };
  res.render("urls_index", templateVars);
});

//Response for /urls/new path
app.get("/urls/new", (req, res) => {
  const currentUser = users[req.cookies["user"]];
  const templateVars = { currentUser };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});






// vvv BUTTONS vvv //

//Handles post responses coming in from submission form (/urls/new path)
app.post("/urls", (req, res) => {
  let id = generateRandomString();  //Assign my random string output to id
  urlDatabase[id] = req.body.longURL;  //Add id and longURL propert to existing urlDatabase object
  res.redirect(`/urls/${id}`);  //Use res.redirect to redirect user to the new id in browser
});

//Handles POST route that DELETEs URL from our urlDatabase object (triggered by delete button)
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/");  //Use res.redirect to redirect user to the urls index page
});                        //!! res.redirect only works with path, cannot pass template as argument

//Handles POST route that redirects user to the Edit page (triggered by Edit button)
app.post("/urls/:id/edit", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);  //Redirect to the urlDatabase[id] page
});

//Handles POST route that submits the updated URL to our urlDatabase object (triggered by Submit button)
app.post("/urls/:id/submit", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/");  //Use res.redirect to redirect user to the urls index page after submit
});






// vvv LOGIN/LOGOUT & COOKIES vvv //

//Handle login, set username to cookie
app.post("/login", (req, res) => {
  const user = req.body.username;
  res.cookie("user" , userId);
  res.redirect("/urls/"); //
});

//Handle logout, clear cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/urls/"); //
});

//Handle POST route that registers new user
app.post("/register", (req, res) => {

  //Check if user exists
  for (const user in users) {
    console.log(users[user].email);
    if (req.body.email === users[user].email) {
      res.status(400).send('User already registered.  Please try to login.');
      console.log(users);
      return;
    }
  }
  //Check email and password both entered
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Enter email and password to register');
    console.log(users);
    return;
  }


  
  const userId = generateRandomString();

  users[userId] = {email: req.body.email,
    password: req.body.password};

  res.cookie("user" , userId);
  res.redirect("/urls/");
});




//Handles redirect to longURL when short URL is used
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


//Handles /urls/:id path.  id and longURL passed to ejs template through templateVars variable
app.get("/urls/:id", (req, res) => {
  const currentUser = users[req.cookies["user"]];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], currentUser };
  res.render("urls_show", templateVars);
});
  
    
    
//Setup listener for requests
app.listen(PORT, () => {
  console.log(`Vik's TinyURL app listening on port ${PORT}!`);
});
