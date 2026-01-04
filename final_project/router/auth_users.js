const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

  const token = jwt.sign({ data: username }, "access", { expiresIn: "1h" });
  req.session.authorization = { token, username };
  return res.status(200).json({ message: "User successfully logged in", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!review || review.trim() === "") {
    return res.status(400).json({ message: "Review content cannot be empty" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review.trim();

  return res.status(200).json({ message: "Review has been added / updated successfully", ...books[isbn] })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
