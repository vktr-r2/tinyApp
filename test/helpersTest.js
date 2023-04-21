const { assert } = require('chai');

const { userLookup, urlsForUser } = require('../helper-functions');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


const testURLs = {
  b6UTxQ: {
    id: "b6UTxQ",
    longURL: "https://www.tsn.ca",
    userID: "user2RandomID",
    createdAt: "2023-01-01",
    usageTally: 0
  },
  i3BoGr: {
    id: "i3BoGr",
    longURL: "https://www.google.ca",
    userID: "user2RandomID",
    createdAt: '2023-01-01',
    usageTally: 0
  }
};


describe('userLookup', function() {
  it('should return with a valid user profile', function() {
    const user = userLookup("user@example.com", testUsers)
    const expectedUserID = testUsers.userRandomID;
    assert.deepEqual(user === expectedUserID, true);
  });
  it('should return NULL if user does not exist', function() {
    const user = userLookup("fail@example.com", testUsers)
    const expectedUserID = null;
    assert.deepEqual(user === expectedUserID, true);
  });
});


describe('urlsForUser', function() {
  it('should return with a valid object of URLs', function() {
    const userID = "user2RandomID";
    const expectedURLs = testURLs;
    const returnedURLs = urlsForUser("user2RandomID", testURLs);
    assert.deepEqual(expectedURLs , returnedURLs);
  });
  it('should return empty object if user does not exist', function() {
    const returnedURLs = urlsForUser("notUser", testURLs);
    assert.deepEqual(returnedURLs , {});
  });
  it('should return empty object if user has no URLs', function() {
    const returnedURLs = urlsForUser("userRandomID", testURLs);
    assert.deepEqual(returnedURLs , {});
  });
});


