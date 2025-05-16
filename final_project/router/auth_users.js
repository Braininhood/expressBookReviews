const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// File path for storing users
const usersFilePath = path.join(__dirname, '../users.json');

// Initialize users array
let users = [];

// Load users from file if it exists
try {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    users = JSON.parse(data);
    console.log(`Loaded ${users.length} users from file`);
  }
} catch (err) {
  console.error('Error loading users file:', err);
}

// Function to save users to file
const saveUsers = () => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    console.log('Users saved to file');
  } catch (err) {
    console.error('Error saving users to file:', err);
  }
};

// Function to encrypt password (same as in general.js)
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  return sha256.update(password).digest('base64');
};

const isValid = (username) => { //returns boolean
  // Check if the username exists in the users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  // Check if username and password match the ones in records
  const hashedPassword = getHashedPassword(password);
  return users.some(user => user.username === username && user.password === hashedPassword);
}

// Export the addUser function to be used in general.js
const addUser = (username, hashedPassword) => {
  users.push({username, password: hashedPassword});
  saveUsers(); // Save to file after adding
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if the user is valid
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid username or password"});
  }
  
  // Generate JWT token
  const token = jwt.sign({username: username}, "access", {expiresIn: '1h'});
  
  // Store token in session
  req.session.authorization = {
    accessToken: token
  };
  
  return res.status(200).json({
    message: "User successfully logged in",
    token: token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
  
  // Check if review is provided
  if (!review) {
    return res.status(400).json({message: "Review text is required"});
  }
  
  // Get username from JWT token
  const username = req.user.username;
  
  // Add or update the review
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({message: `The review for book ISBN ${isbn} has been added/updated`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
  
  // Get username from JWT token
  const username = req.user.username;
  
  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: `You don't have a review for book with ISBN ${isbn}`});
  }
  
  // Delete the review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({message: `Review for book ISBN ${isbn} posted by user ${username} deleted`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.addUser = addUser;
