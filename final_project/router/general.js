const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const crypto = require('crypto');
const { addUser } = require("./auth_users.js");
const axios = require('axios');

// Function to encrypt password
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  return sha256.update(password).digest('base64');
};

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Hash the password
  const hashedPassword = getHashedPassword(password);
  
  // Add user to the users array and save to file
  addUser(username, hashedPassword);
  
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Task 10 - Get all books using async-await with Axios
public_users.get('/async/allbooks', async (req, res) => {
  try {
    // Simulate an API call using axios (in a real app, this would be a call to a different API)
    // For demonstration, we'll use setTimeout to create an async operation
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
    };
    
    // Wait for the async operation to complete
    const booksData = await getAllBooks();
    
    // Return the result
    return res.status(200).json(booksData);
  } catch (error) {
    console.error("Error fetching all books:", error);
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
 });

// Task 11 - Get book details based on ISBN using async-await with Promises
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    
    // Create a promise that resolves with the book data
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error(`Book with ISBN ${isbn} not found`));
          }
        }, 1000);
      });
    };
    
    // Wait for the promise to resolve
    const bookData = await getBookByISBN(isbn);
    
    // Return the book data
    return res.status(200).json(bookData);
  } catch (error) {
    console.error("Error fetching book by ISBN:", error);
    return res.status(404).json({ message: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const booksbyauthor = [];
  
  keys.forEach(key => {
    if (books[key].author === author) {
      booksbyauthor.push({
        isbn: key,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });
  
  if (booksbyauthor.length > 0) {
    return res.status(200).json({ booksbyauthor });
  } else {
    return res.status(404).json({message: `No books found for author: ${author}`});
  }
});

// Task 12 - Get book details based on author using async-await with Promises
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    
    // Create a promise that resolves with the books by author
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const keys = Object.keys(books);
          const booksbyauthor = [];
          
          keys.forEach(key => {
            if (books[key].author === author) {
              booksbyauthor.push({
                isbn: key,
                title: books[key].title,
                reviews: books[key].reviews
              });
            }
          });
          
          if (booksbyauthor.length > 0) {
            resolve({ booksbyauthor });
          } else {
            reject(new Error(`No books found for author: ${author}`));
          }
        }, 1000);
      });
    };
    
    // Wait for the promise to resolve
    const authorBooks = await getBooksByAuthor(author);
    
    // Return the books data
    return res.status(200).json(authorBooks);
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const booksbytitle = [];
  
  keys.forEach(key => {
    if (books[key].title === title) {
      booksbytitle.push({
        isbn: key,
        author: books[key].author,
        reviews: books[key].reviews
      });
    }
  });
  
  if (booksbytitle.length > 0) {
    return res.status(200).json({ booksbytitle });
  } else {
    return res.status(404).json({message: `No books found with title: ${title}`});
  }
});

// Task 13 - Get book details based on title using async-await with Promises
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    
    // Create a promise that resolves with the books by title
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const keys = Object.keys(books);
          const booksbytitle = [];
          
          keys.forEach(key => {
            if (books[key].title === title) {
              booksbytitle.push({
                isbn: key,
                author: books[key].author,
                reviews: books[key].reviews
              });
            }
          });
          
          if (booksbytitle.length > 0) {
            resolve({ booksbytitle });
          } else {
            reject(new Error(`No books found with title: ${title}`));
          }
        }, 1000);
      });
    };
    
    // Wait for the promise to resolve
    const titleBooks = await getBooksByTitle(title);
    
    // Return the books data
    return res.status(200).json(titleBooks);
  } catch (error) {
    console.error("Error fetching books by title:", error);
    return res.status(404).json({ message: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(
      books[isbn].reviews
    );
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});

module.exports.general = public_users;
