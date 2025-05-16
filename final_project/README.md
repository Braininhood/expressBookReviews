# Express Book Reviews API

## Project Overview
This project is a RESTful API for managing book reviews. It provides endpoints for listing books, searching books by various criteria, registering users, authenticating users, and managing book reviews.

## Features
- Get lists of books (synchronous and async implementations)
- Search books by ISBN, author, and title
- User registration with password encryption
- User authentication using JWT tokens
- Add/update book reviews (only for authenticated users)
- Delete book reviews (only for authenticated users)

## Project Structure
- `index.js` - Main application file
- `router/` - Contains all route handlers
  - `booksdb.js` - Book data
  - `general.js` - Routes for general (non-authenticated) users
  - `auth_users.js` - Routes for authenticated users
- `users.json` - Persistent storage for user data

## API Endpoints

### General User Routes
- `GET /` - Get all books
- `GET /isbn/:isbn` - Get book by ISBN
- `GET /author/:author` - Get books by author
- `GET /title/:title` - Get books by title
- `GET /review/:isbn` - Get reviews for a book
- `POST /register` - Register a new user

### Async Routes (Promise-based)
- `GET /async/allbooks` - Get all books (async)
- `GET /async/isbn/:isbn` - Get book by ISBN (async)
- `GET /async/author/:author` - Get books by author (async)
- `GET /async/title/:title` - Get books by title (async)

### Authenticated User Routes
- `POST /customer/login` - Login
- `PUT /customer/auth/review/:isbn` - Add/update a book review
- `DELETE /customer/auth/review/:isbn` - Delete a book review

## Technologies
- Node.js
- Express.js
- JWT for authentication
- Async/await and Promises
- Crypto for password hashing

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `node index.js`

## Testing
Use Postman or curl to test the API endpoints.