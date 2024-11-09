const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs')
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    name: "session",
    keys: ["user_ID"],
  })
);

const shortURLID = () => uuidv4().slice(0, 6);

// GLOBAL VARIABLES

// Links stored in object to be rendered on page
const URL_DATABASE = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// Object of registered users
const USERS = {};

// Checks user data in users object
const getUserData = (value, key, obj) => {
  for (let userID in obj) {
    if (obj[userID][key] === value) {
      return obj[userID];
    }
  }
  return null;
};

const getUserByEmail = (email, obj) => {
  for (let userID in obj) {
    if (obj[userID].email === email) { 
      return obj[userID];
    }
  }
  return null;
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Home page - urls_index.js

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls", (req, res) => {
  if (!req.session.user_ID) {
    return res.status(403).send("You must be logged in to access this page.");
  }
  const user = USERS[req.session.user_ID];
  const templateVars = { user, urls: URL_DATABASE };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.session.user_ID) {
    return res.status(403).send("You must be logged in to create a tiny URL");
  }
  const shortUrl = shortURLID();
  URL_DATABASE[shortUrl] = {
    longURL: req.body.longURL,
    userID: req.session.user_ID,
  };
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const deletedURL = URL_DATABASE[req.params.id]
  const currentUser = USERS[req.session.user_ID]
  if(!deletedURL) {
    return res.status(404).send('URL does not exist.')
  } if(deletedURL.userID === currentUser.id) {
    delete URL_DATABASE[req.params.id];
    res.redirect("/urls");
  } else {
    return res.status(401).send('Cannot delete another user\'s URL');
  }
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_ID) {
    return res.redirect("/login");
  } 
  res.render("urls_new", { user: USERS[req.session.user_ID] });
});

app.post("/urls/:id/edit", (req, res) => {
  const editURL = URL_DATABASE[req.params.id]
  const currentUser = USERS[req.session.user_ID]
  const { id } = req.params;

  if (!req.session.user_ID) {
    return res.redirect("/login");
  } if (!editURL) {
    return res.status(404).send('URL does not exist.')
  } if (editURL.userID === currentUser.id) {
    URL_DATABASE[id].longURL = req.body.longURL;
    return res.redirect("/urls");
  } else {
    return res.status(401).send('Cannot edit another user\'s URL');
  }
});

app.get("/urls/:id", (req, res) => {
  const { id } = req.params;
  const longURL = URL_DATABASE[id];
  console.log('longURL', longURL)
  if (!longURL) {
    return res.status(403).send("URL does not exist");
  }
  const templateVars = { 
    id, 
    longURL: longURL.longURL, 
    user: USERS[req.session.user_ID],
  };
  res.render("urls_show", templateVars);
});

// Login and Authentication

app.get("/login", (req, res) => {
  if (req.session.user_ID) {
    return res.redirect("/urls");
  }
  res.render("login", { user: null });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userAuth = getUserByEmail(email, USERS);

  if (userAuth) {
    const hashedPassword = userAuth['password']
    if (bcrypt.compareSync(password, hashedPassword)) { 
      req.session.user_ID = userAuth.id;
      return res.redirect("/urls");
    } else {
      return res.status(401).send("Incorrect Password");
    }
  } else {
    return res.status(401).send("Email not found");
  }
});

// Logout

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// Registration

app.get("/register", (req, res) => {
  res.render("urls_register", { user: null });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter valid info to register");
  }

  if (getUserData(email, "email", USERS)) {
    return res.status(400).send("User already exists, please enter a new email address");
  }

  const userID = shortURLID();
  USERS[userID] = {
    id: userID,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  req.session.user_ID = userID;
  res.redirect("/urls");
});