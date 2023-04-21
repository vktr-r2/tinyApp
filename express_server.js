// Import express / Assign it to variable "app" for convenience / Set default port
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const crypto = require("crypto");
const { generateRandomString, userLookup, urlsForUser } = require("./helper-functions");

const app = express();
const PORT = 8080;

//Setup listener for requests
app.listen(PORT, () => {
  console.log(`Vik's TinyURL app listening on port ${PORT}!`);
});


//<<<<<< SET KEYS >>>>>>\\
const keys = [
  crypto.randomBytes(32).toString("hex"),
  crypto.randomBytes(32).toString("hex")
];


//<<<<< MIDDLEWARE >>>>>\\
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: keys
}));


//<<<<< DATABASES >>>>>\\
// URLs
const urlDatabase = {
  b6UTxQ: {
    id: "b6UTxQ",
    longURL: "https://www.tsn.ca",
    userID: "aCJZuBd",
    createdAt: "2023-01-01",
    visits: 0
  },
  i3BoGr: {
    id: "i3BoGr",
    longURL: "https://www.google.ca",
    userID: "aCJZuBd",
    createdAt: "2023-01-01",
    visits: 0
  },

  lhTr1v: {
    id: "aCJZlhTr1vBd",
    longURL: "https://www.google.ca",
    userID: "aCJZuBd",
    createdAt: "2023-01-01",
    visits: 0
  }

};

//Registered Users
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
  aCJZuBd: {
    id: 'aCJZuBd',
    email: 'admin@test.com',
    password: '$2a$10$oSXgnrdULb5xplK3/4/B2uqCQGL3v9Zy/ZKfPYfNNxzlrIl08/BpC'
  }
};



//GET homepage(login page)
app.get("/", (req, res) => {
  res.render("urls_login");
  return;
});


//GET URLs index page > send data to template via templateVars
app.get("/urls", (req, res) => {
  const currentUser = users[req.session.user_id];
  if (currentUser) {
    const myURLs = urlsForUser(currentUser.id, urlDatabase);
    const templateVars = {
      urls: myURLs,
      currentUser
    };
    res.render("urls_index", templateVars);
    return;
  }
  res.render("urls_login");
  return;
});


//GET NEW URL page
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.render("urls_login");
    return;
  }
  const currentUser = users[req.session.user_id];
  const templateVars = { currentUser };
  res.render("urls_new", templateVars);
  return;
});

//GET registration form page
app.get("/register", (req, res) => {
  res.render("urls_register");
  return;
});

//GET login form page
app.get("/login", (req, res) => {
  if (!req.session.user_id) {
    res.render("urls_login");
    return;
  }
  res.redirect("/urls");
  return;
});

//GET longURL page when short URL used
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;

  if (longURL === undefined) {
    res.status(404).send("URL not found");
    return;
  }

  urlDatabase[req.params.id].visits ++;

  res.redirect(longURL);
  return;
});


//GET short URL page within app
app.get("/urls/:id", (req, res) => {
  const currentUser = users[req.session.user_id];

  if (!currentUser) {
    res.status(403).send("Forbidden : You do not have access to this page.");
    return;
  }

  const myURLs = urlsForUser(currentUser.id, urlDatabase);
  
  for (const URL in myURLs) {
    if (req.params.id === URL) {
      const templateVars = {
        id: req.params.id,
        longURL: urlDatabase[req.params.id].longURL,
        Created: urlDatabase[req.params.id].createdAt,
        Visits: urlDatabase[req.params.id].visits,
        currentUser
      };
      res.render("urls_show", templateVars);
      return;
    }
  }

  res.status(403).send("Forbidden : You do not have access to this page.");
  return;
});




//<<<<< POST >>>>>\\

//POST new URL object for user
app.post("/urls", (req, res) => {
  //If not logged in, throw 403
  if (!req.session.user_id) {
    res.status(403).send("Must be logged in to submit URLs");
    return;
  }
  //Store new created_at date and unique ID for URL object
  const id = generateRandomString();
  let date = new Date();
  date = date.toLocaleDateString();

  //Create new URL object
  urlDatabase[id] = {
    id,
    longURL: req.body.longURL,
    userID: req.session.user_id,
    createdAt: date,
    visits: 0
  };
  //Redirect user to new URL's page
  res.redirect(`/urls/${id}`);
  return;
});

//POST DELETE existing URL object (delete button)
app.post("/urls/:id/delete", (req, res) => {
  //Set currentUser to cookie "user"
  const currentUser = users[req.session.user_id];
  //Set myURLs to match URLs avail for currentUser
  const myURLs = urlsForUser(currentUser.id, urlDatabase);
  //If URL to be changed is in myURLs for user, delete
  for (const URL in myURLs) {
    if (req.params.id === URL) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls/");
      return;
    }
  }
  //If user doesn't have permission to delete, throw 403
  res.status(403).send("Forbidden : You do not have access to this page.");
  return;
});


//POST redirects user to the URL/Edit page
app.post("/urls/:id/edit", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);  //Redirect to the urlDatabase[id] page
  return;
});

//POST submit new long URL to existing shortened URL id
app.post("/urls/:id/submit", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  urlDatabase[req.params.id].visits = 0;
  res.redirect("/urls/");
  return;
});






//<<<<< POST: LOGIN/LOGOUT & SET COOKIES >>>>>\\

//POST Handle login, set username to cookie
app.post("/login", (req, res) => {
  //Store email and password from form
  const email = req.body.email;
  const password = req.body.password;
  //Store result of userToVerify function for email that was submitted
  const userToVerify = userLookup(email, users);

  //Email doesn't exist
  if (userToVerify === null) {
    res.status(403).send("Email or password does not match");
    return;
  }

  //Email exists
  if (userToVerify !== null) {
    //Wrong password
    if (bcrypt.compareSync(password, userToVerify.password) === false) {
      res.status(403).send("Email or password does not match");
      return;
    }
    //Correct password
    if (bcrypt.compareSync(password, userToVerify.password) === true) {
      const userId = userToVerify.id;
      req.session.user_id = userId;
      
    }
  }

  res.redirect("/urls/");
  return;
});

//POST Logout, clear cookie
app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
  return;
});

//POST register new user
app.post("/register", (req, res) => {

  //Check if user exists
  if (userLookup(req.body.email, users) !== null) {
    res.status(400).send("User already registered. Please try to login.");
    return;
  }

  //Check email and password both entered
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Enter email and password to register");
    return;
  }

  //If user doesn't already exist
  if (userLookup(req.body.email, users) === null) {
    //Generate new unique userId for new registration
    const userId = generateRandomString();
    //Add email and password values to new user
    users[userId] = {id: userId, email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)};
    
    //Set cookie to logged-in state
    req.session.user_id = userId;
    res.redirect("/urls/");
    
    return;
  }
});
