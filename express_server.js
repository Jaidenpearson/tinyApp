const express = require("express");
const { v4: uuidv4 }= require('uuid')
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const shortURLID = () => {
  let id = uuidv4()
  return id.slice(0, 6)
};

//Links stored in object to be rendered on page 

const urlDatabase = {
};

//User info stored here

const users = {};

//Checks user data in users object

const getUserData = (value, key, obj) => {
  return Object.values(obj).some(user => user[key] === value)
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Home page - urls_index.js

app.get('/', (req, res) => { //root home page redirects to Login
  res.redirect('/login')
})

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.cookies['email'] || null,
    password: req.cookies['password'],
   };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortUrl = shortURLID();    //Assigns short URL and link to submission, redirects to link page
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

//Deletes link when button is pushed

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
 res.redirect('/urls')
})

//Page for adding new links

app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.cookies['email'] || null,
    password: req.cookies['password'],
   };
  res.render("urls_new", templateVars);
});

app.post('/urls/:id/edit', (req, res) => { //Updates url from the ID page and redirects to /urls
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect('/urls')
})

//Displays link specific page

app.get("/urls/:id", (req, res) => {  
  const longURL = urlDatabase[req.params.id]
  const templateVars = { 
    urls: urlDatabase,
    email: req.cookies['email'] || null,
    password: req.cookies['password'],
    id: req.params.id, 
    longURL: longURL,
  }
  res.render("urls_show", templateVars);
});

//Login and Authentication

app.get('/login', (req, res) => {
  templateVars = {email: req.cookies.email}
  res.render('login', templateVars)
})

app.post('/login', (req, res) => {

  if(getUserData(req.body.email, 'email', users)) { //Checks users object for matching email in registered users
    if (!getUserData(req.body.password, 'password', users)) { //Checks for falsey if password doesn't match one in currentUser
      return res.status(403).send('Incorrect password')
    } else if(getUserData(req.body.password, 'password', users)) {  //Checks for truthy if password matches one in currentUser
      res.cookie('email', req.body.email)
      res.cookie('password', req.body.password)
      res.redirect('/urls')
    }
  } else if(!getUserData(req.body.email, 'email', users)) {
    return res.status(403).send('Email cannot be found')
  } 
})

//Logout

app.post('/logout', (req, res) => {
  res.clearCookie('email')
  res.clearCookie('password')
  res.redirect('/login')
})

//Registration

app.get('/register', (req, res) => {
  const templateVars = {email: req.cookies.email}
  res.render('urls_register', templateVars)
})

app.post('/register', (req, res) => {
  const userID = shortURLID()

  if(getUserData(req.body.email, 'email', users)) {
    return res.status(400).send('User already exists, please enter new email address')
}

  res.cookie('email', req.body.email),
  res.cookie('password', req.body.password)

  if(!req.body.email || !req.body.password) {
    return res.status(400).send('Please enter valid info to register')
  } 

users[userID] = {
  id: userID,
  email: req.body.email,
  password: req.body.password,
}

console.log('users', users)

res.redirect('/urls')
})












// app.post("/urls", (req, res) => {
//   req.body // {id: qwerty, longURL: "google.com"}


// })

// //without an express middleware
// app.post("/urls") 
// app.post("/urls/:id/edit")
// app.post("/urls/:id/delete")

// DELETE "/urls/b2xVn2"
// POST "/url" body {id: qwerty, longURL: "google.com"}

// app.put("/urls/:resourceID", (req, res) => {
//   urlDatabase[req.params.resourceID] =  {
//     [req.body.id]: req.body.longURL
//   }
// })

// //PUT "/urls/2"  body -> {id: "asdf", longURL: "yahoo.com"}

// {
//   1: {
//     "b2xvn2": "google.com"
//   }, 
//   2: {

//   }
// }
// 1. id, longURL
// 2. 




// BREAD - browse, read, edit, add, delete
// B get all urls
// R get a details of a specific url
// E/U edit a url 
// A add a url
// D delete a url

/*
const urls = {
1. qwert - "lighthouse labs"
2. asdf - google.com 
}

edit and update - translate to post, put, patch HTTP verbs
post - create a resource
app.post("/urls")

put - replace a resource 
app.post("/urls/") - query parameter

patch - update a resource


GET and POST -
need a middleware 


*/
