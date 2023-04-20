// Import express / Assign it to variable 'app' for convenience / Set default port
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;


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
  const myURLs = {}
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
});


//GET URLs index page > send data to template via templateVars
app.get("/urls", (req, res) => {
  const currentUser = users[req.cookies["user"]];
  if (currentUser) {
  myURLs = urlsForUser(currentUser.id);
  const templateVars = {
    urls: myURLs,
    currentUser
  };
  res.render("urls_index", templateVars);
}
res.render("urls_login")
});


//GET NEW URL page
app.get("/urls/new", (req, res) => {
  if (!req.cookies["user"]) {
    res.render("urls_login")
    return;
  }
  const currentUser = users[req.cookies["user"]];
  const templateVars = { currentUser };
  res.render("urls_new", templateVars);
});

//GET registration form page
app.get("/register", (req, res) => {
  res.render("urls_register");
});

//GET login form page
app.get("/login", (req, res) => {
  if (!req.cookies["user"]) {
    res.render("urls_login")
  }
  res.redirect("/urls")
});

//GET longURL page when short URL used
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;

  if (longURL === undefined) {
    res.status(404).send('URL not found')
  }

  res.redirect(longURL);
});




//<<<<< BUTTONS >>>>>\\

//Handles post responses coming in from submission form (/urls/new path)
app.post("/urls", (req, res) => {
  if (!req.cookies["user"]) {
    res.status(403).send('Must be logged in to submit URLs')
    return;
    }
  const id = generateRandomString();  //Assign my random string output to id
  let date = new Date();              //Find date for new URL object 
  date = date.toLocaleDateString();

  //create new URL object, store url id,
  urlDatabase[id] = {
    id,
    longURL: req.body.longURL,
    userID: req.cookies["user"],
    createdAt: date
  };
  res.redirect(`/urls/${id}`);  //Use res.redirect to redirect user to the new id in browser
  return;
});

//Handles POST route that DELETEs URL from our urlDatabase object (triggered by delete button)
app.post("/urls/:id/delete", (req, res) => {

  const currentUser = users[req.cookies["user"]];
  myURLs = urlsForUser(currentUser.id);
  for (const URL in myURLs) {
    if (req.params.id === URL) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls/");
    }}

    res.status(403).send('Forbidden : You do not have access to this page.')

});


//Handles POST route that redirects user to the Edit page (triggered by Edit button)
app.post("/urls/:id/edit", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);  //Redirect to the urlDatabase[id] page
});

//Handles POST route that submits the updated URL to our urlDatabase object (triggered by Submit button)
app.post("/urls/:id/submit", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect("/urls/");  //Use res.redirect to redirect user to the urls index page after submit
});






//<<<<< LOGIN/LOGOUT & SET COOKIES >>>>>\\

//POST Handle login, set username to cookie
app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const userToVerify = userLookup(email);

  //Email doesn't exist
  if (userToVerify === null) {
    res.status(403).send('Email or password does not match');
  }

  //Email exists
  if (userToVerify !== null) {
    //Wrong password
    if (userToVerify.password !== password) {
      res.status(403).send('Email or password does not match');
    }
    //Correct password
    if (userToVerify.password === password) {
      const userId = userToVerify.id;
      res.cookie("user", userId);
    }
  }

  res.redirect("/urls/");
});

//POST Logout, clear cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/login"); //
});


//POST register new user
app.post("/register", (req, res) => {

  //Check if user exists
  if (userLookup(req.body.email) !== null) {
    res.status(400).send('User already registered. Please try to login.');
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
    
    console.log(users[userId]);
    //Set cookie to logged-in state
    res.cookie("user" , userId);
    res.redirect("/urls/");
  }
});


//GET short URL page within app
app.get("/urls/:id", (req, res) => {
  const currentUser = users[req.cookies["user"]];

  if (!currentUser) {
    res.status(403).send('Forbidden : You do not have access to this page.')
  }

  myURLs = urlsForUser(currentUser.id);
  
  for (const URL in myURLs) {
    if (req.params.id === URL) {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, currentUser };
  res.render("urls_show", templateVars);
    }}

  res.status(403).send('Forbidden : You do not have access to this page.')
});
  
    
    
//Setup listener for requests
app.listen(PORT, () => {
  console.log(`Vik's TinyURL app listening on port ${PORT}!`);
});
