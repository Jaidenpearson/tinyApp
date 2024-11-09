const getUserByEmail = (email, obj) => {
  for (let userID in obj) {
    if (obj[userID].email === email) { 
      return obj[userID];
    }
  }
  return null;
};

module.exports = getUserByEmail