const { v4: uuidv4 } = require("uuid");

const getUserByEmail = (email, obj) => {
  for (let userID in obj) {
    if (obj[userID].email === email) { 
      return obj[userID];
    }
  }
  return null;
};

const urlsForUser = (userID, obj) => {
  let filteredURLS = {}

  for(let id in obj) {
    if(obj[id].userID === userID) {
      filteredURLS[id] = obj[id]
    }
  }
  return filteredURLS
}

const shortURLID = () => uuidv4().slice(0, 6);

const URL_DATABASE = {};

const USERS = {};

module.exports = {getUserByEmail, urlsForUser, shortURLID, URL_DATABASE, USERS}