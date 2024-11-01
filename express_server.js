const express = require("express");
const { v4: uuidv4 }= require('uuid')
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));

const shortURLID = () => {
  let id = uuidv4()
  return id.slice(0, 6)
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/', (res, req) => {
  req.redirect('/urls')
})

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const shortUrl = shortURLID();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
  console.log(urlDatabase)
})

app.get("/urls/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  const templateVars = { id: req.params.id, longURL: longURL};
  res.render("urls_show", templateVars);
});










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
