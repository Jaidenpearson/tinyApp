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

module.exports = {getUserByEmail, urlsForUser}