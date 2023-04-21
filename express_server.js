// Import express / Assign it to variable 'app' for convenience / Set default port
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;

//Setup listener for requests
app.listen(PORT, () => {
  console.log(`Vik's TinyURL app listening on port ${PORT}!`);
});

//<<<<< MIDDLEWARE >>>>>\\
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//<<<<< DATABASES >>>>>\\
// URLs
const urlDatabase = {
  b6UTxQ: {
    id: "b6UTxQ",
    longURL: "https://www.tsn.ca",
    userID: "admin",
    createdAt: "2023-01-01",
    usageTally: 0
  },
  i3BoGr: {
    id: "i3BoGr",
    longURL: "https://www.google.ca",
    userID: "userRandomID",
    createdAt: '2023-01-01',
    usageTally: 0
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
  admin: {
    id: "admin",
    email: "vik.ristic@gmail.com",
    password: "123test"
  }
};


//<<<<< HELPER FUNCTIONS >>>>>\\
//Generate random 6 char string (URL and user IDs)
const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i <= 6; i++) {
    let charIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[charIndex];
  }
  return randomString;
};

//Lookup users
const userLookup = (email) => {
  for (const user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
  return null;
};

//Lookup URLs for user
const urlsForUser = (id) => {
  const myURLs = {};
  for (const URL in urlDatabase) {
    // console.log(URL);
    // console.log(urlDatabase[URL].userID);
    if (id === urlDatabase[URL].userID) {
      myURLs[URL] = urlDatabase[URL];
    }
  }
  return myURLs;
};




//GET homepage(login page)
app.get("/", (req, res) => {
  res.render("urls_login");
  return;
});


//GET URLs index page > send data to template via templateVars
app.get("/urls", (req, res) => {
  const currentUser = users[req.cookies["user"]];
  if (currentUser) {
    const myURLs = urlsForUser(currentUser.id);
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
  if (!req.cookies["user"]) {
    res.render("urls_login");
    return;
  }
  const currentUser = users[req.cookies["user"]];
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
  if (!req.cookies["user"]) {
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
    res.status(404).send('URL not found');
    return;
  }

  res.redirect(longURL);
  return;
});




//<<<<< BUTTONS >>>>>\\

//POST new URL object for user
app.post("/urls", (req, res) => {
  //If not logged in, throw 403
  if (!req.cookies["user"]) {
    res.status(403).send('Must be logged in to submit URLs');
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
    userID: req.cookies["user"],
    createdAt: date,
    usageTally: 0
  };
  //Redirect user to new URL's page
  res.redirect(`/urls/${id}`);
  return;
});

//POST DELETE existing URL object (delete button)
app.post("/urls/:id/delete", (req, res) => {
  //Set currentUser to cookie "user"
  const currentUser = users[req.cookies["user"]];
  //Set myURLs to match URLs avail for currentUser
  const myURLs = urlsForUser(currentUser.id);
  //If URL to be changed is in myURLs for user, delete
  for (const URL in myURLs) {
    if (req.params.id === URL) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls/");
      return;
    }
  }
  //If user doesn't have permission to delete, throw 403
  res.status(403).send('Forbidden : You do not have access to this page.');
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
  res.redirect("/urls/");
  return;
});






//<<<<< LOGIN/LOGOUT & SET COOKIES >>>>>\\

//POST Handle login, set username to cookie
app.post("/login", (req, res) => {
  //Store email and password from form
  const email = req.body.email;
  const password = req.body.password;
  //Store result of userToVerify function for email that was submitted
  const userToVerify = userLookup(email);

  //Email doesn't exist
  if (userToVerify === null) {
    res.status(403).send('Email or password does not match');
    return;
  }

  //Email exists
  if (userToVerify !== null) {
    //Wrong password
    if (bcrypt.compareSync(password, userToVerify.password) === false) {
      res.status(403).send('Email or password does not match');
      return;
    }
    //Correct password
    if (bcrypt.compareSync(password, userToVerify.password) === true) {
      const userId = userToVerify.id;
      res.cookie("user", userId);
      return;
    }
  }

  res.redirect("/urls/");
  return;
});

//POST Logout, clear cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user")
  res.redirect("/login");
  return;
});

//POST register new user
app.post("/register", (req, res) => {

  //Check if user exists
  if (userLookup(req.body.email) !== null) {
    res.status(400).send('User already registered. Please try to login.');
    return;
  }

  //Check email and password both entered
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Enter email and password to register');
    return;
  }

  //If user doesn't already exist
  if (userLookup(req.body.email) === null) {
    //Generate new unique userId for new registration
    const userId = generateRandomString();
    
    //Add email and password values to new user
    users[userId] = {id: userId, email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)};
    
    //Set cookie to logged-in state
    res.cookie("user" , userId)
    res.redirect("/urls/");
    return;
  }
});


//GET short URL page within app
app.get("/urls/:id", (req, res) => {
  const currentUser = users[req.cookies["user"]];

  if (!currentUser) {
    res.status(403).send('Forbidden : You do not have access to this page.');
    return;
  }

  const myURLs = urlsForUser(currentUser.id);
  
  for (const URL in myURLs) {
    if (req.params.id === URL) {
      const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, currentUser };
      res.render("urls_show", templateVars);
      return;
    }
  }

  res.status(403).send('Forbidden : You do not have access to this page.');
  return;
});
  
    
    
