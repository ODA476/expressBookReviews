// const express = require('express');
// let books = require("./booksdb.js");
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
// const public_users = express.Router();

// public_users.post("/register", (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Username and password are required" });
//   }

//   const trimmedUsername = username.trim();
//   if (trimmedUsername === "") {
//     return res.status(400).json({ message: "Username cannot be empty or just spaces" });
//   }

//   if (users.find(user => user.username === trimmedUsername)) {
//     return res.status(409).json({ message: "Username already exists" });
//   }

//   users.push({ username: trimmedUsername, password: password });
//   return res.status(201).json({ message: "User registered successfully" });
// });

// // Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   res.status(200).send(JSON.stringify(books));
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).send(JSON.stringify(books[isbn]));
//   }
//   return res.status(404).json({ message: "Book not found" });
// });

// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   const keys = Object.keys(books);
//   const matchingBooks = [];

//   for (let isbn of keys) {
//     const book = books[isbn];
//     if (book.author.toLowerCase() === author.toLowerCase()) {
//       matchingBooks.push({ isbn: isbn, ...book });
//     }
//   }

//   if (matchingBooks.length > 0) {
//     return res.status(200).send(JSON.stringify(matchingBooks));
//   }
//   return res.status(404).json({ message: "No books found by this author" });
// });

// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   const keys = Object.keys(books);
//   const matchingBooks = [];

//   for (let isbn of keys) {
//     const book = books[isbn];
//     if (book.title.toLowerCase() === title.toLowerCase()) {
//       matchingBooks.push({ isbn: isbn, ...book });
//     }
//   }

//   if (matchingBooks.length > 0) {
//     return res.status(200).send(JSON.stringify(matchingBooks));
//   }
//   return res.status(404).json({ message: "No books found by this title" });
// });

// //  Get book review
// public_users.get('/review/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).send(JSON.stringify(books[isbn].reviews));
//   }
//   return res.status(404).json({ message: "Book not found" });
// });

// module.exports.general = public_users;



const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// --- Helper function to simulate Axios fetching local books ---
function fetchBooks() {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("No books found"));
      }
    }, 100); // 100ms delay
  });
}

// --- Task 10: Get all books ---
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await fetchBooks();
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Task 11: Get book details by ISBN ---
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const allBooks = await fetchBooks();
    if (allBooks[isbn]) {
      res.status(200).json(allBooks[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Task 12: Get books by author ---
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const allBooks = await fetchBooks();
    const matchingBooks = [];

    for (let isbn in allBooks) {
      if (allBooks[isbn].author.toLowerCase() === author) {
        matchingBooks.push({ isbn, ...allBooks[isbn] });
      }
    }

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Task 13: Get books by title ---
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const allBooks = await fetchBooks();
    const matchingBooks = [];

    for (let isbn in allBooks) {
      if (allBooks[isbn].title.toLowerCase() === title) {
        matchingBooks.push({ isbn, ...allBooks[isbn] });
      }
    }

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found by this title" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Get book reviews ---
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const allBooks = await fetchBooks();
    if (allBooks[isbn]) {
      res.status(200).json(allBooks[isbn].reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports.general = public_users;
