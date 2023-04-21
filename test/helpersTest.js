const { assert } = require('chai');

const { userLookup } = require('../helper-functions');

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

describe('userLookup', function() {
  it('should return with a valid user profile', function() {
    const user = userLookup("user@example.com", testUsers)
    const expectedUserID = testUsers.userRandomID;
    assert(user === expectedUserID, true);
  });
});


it('should return NULL if user does not exist', function() {
  const user = userLookup("fail@example.com", testUsers)
  const expectedUserID = null;
  assert(user === expectedUserID, true);
});