const { assert } = require('chai');

const  { getUserByEmail, urlsForUser }  = require('../helpers');


//getUserByEmail

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID)
  });

  it('should return null if user id is not in the users database', function() {
    const fakeuser = getUserByEmail('fakeuser@fraud.com', testUsers)
    assert.isNull(fakeuser)
  })
});

//urlsForUser

describe('urlsForUser', () => {

  it('should return URLs that belong to the specified user', () => {
    const urlDatabase = {
      'b6UTxQ': { longURL: "https://www.tsn.ca", userID: "user123" },
      'i3BoGr': { longURL: "https://www.google.ca", userID: "user123" },
      '9sm5xK': { longURL: "https://www.example.com", userID: "user456" }
    };
    const userId = 'user123';
    const expectedOutput = {
      'b6UTxQ': { longURL: "https://www.tsn.ca", userID: "user123" },
      'i3BoGr': { longURL: "https://www.google.ca", userID: "user123" }
    };
    const result = urlsForUser(userId, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should return only the URLs that belong to the specified user.");
  });

  it('should return an empty object if the user has no URLs', () => {
    const urlDatabase = {
      'b6UTxQ': { longURL: "https://www.tsn.ca", userID: "user123" },
      'i3BoGr': { longURL: "https://www.google.ca", userID: "user123" }
    };
    const userId = 'user456'; // user456 has no URLs in the urlDatabase
    const expectedOutput = {};
    const result = urlsForUser(userId, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should return an empty object if the user has no URLs.");
  });

  it('should return an empty object if there are no URLs in the urlDatabase', () => {
    const urlDatabase = {}; // empty database
    const userId = 'user123';
    const expectedOutput = {};
    const result = urlsForUser(userId, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should return an empty object if there are no URLs in the urlDatabase.");
  });

  it('should not return URLs that don\'t belong to the specified user', () => {
    const urlDatabase = {
      'b6UTxQ': { longURL: "https://www.tsn.ca", userID: "user123" },
      'i3BoGr': { longURL: "https://www.google.ca", userID: "user123" },
      '9sm5xK': { longURL: "https://www.example.com", userID: "user456" }
    };
    const userId = 'user123';
    const expectedOutput = {
      'b6UTxQ': { longURL: "https://www.tsn.ca", userID: "user123" },
      'i3BoGr': { longURL: "https://www.google.ca", userID: "user123" }
    };
    const result = urlsForUser(userId, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should not return URLs that don't belong to the specified user.");
  });
});