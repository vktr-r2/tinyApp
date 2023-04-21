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
const userLookup = (email, userDB) => {
  for (const user in userDB) {
    if (email === userDB[user].email) {
      return userDB[user];
    }
  }
  return null;
};

//Lookup URLs for user
const urlsForUser = (id, urlDB) => {
  const myURLs = {};
  for (const URL in urlDB) {
    // console.log(URL);
    // console.log(urlDatabase[URL].userID);
    if (id === urlDB[URL].userID) {
      myURLs[URL] = urlDB[URL];
    }
  }
  return myURLs;
};


module.exports = { generateRandomString, userLookup, urlsForUser };
