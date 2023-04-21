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
