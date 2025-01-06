WTWR Backend (What to Wear)
This is the backend service for the WTWR (What to Wear) project. It handles requests for managing users and clothing items in the application, including creating, reading, updating, and deleting (CRUD) functionality. The backend now includes authentication and authorization features, interacting with a MongoDB database to persist data and adhering to modern RESTful API design principles.

Project Functionality
The backend provides the following features:

User Management:
Sign up a new user with email, password, name, and avatar.
Sign in an existing user and receive a JWT for authentication.
Retrieve the currently logged-in user's profile.
Update the profile of the logged-in user (name and avatar only).
Clothing Item Management:
Retrieve a list of clothing items.
Create a new clothing item (requires authentication).
Delete a clothing item by ID (only the item's owner can delete it).
Like or dislike a clothing item (requires authentication).
Authentication and Authorization:
Protect all routes except /signup, /signin, and GET /items.
Use JWTs to verify the identity of users and restrict access to their data.
Error Handling:
Handle invalid routes, invalid data, duplicate email errors, and server errors.
Return proper status codes and descriptive error messages.
Technologies Used
This project is built with the following technologies:

Backend Framework:
Express.js: Fast and lightweight web application framework for Node.js.
Database:
MongoDB: NoSQL database for storing users and clothing items.
Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
Authentication and Authorization:
jsonwebtoken: For generating and verifying JWTs.
bcryptjs: For hashing user passwords.
Linting and Code Formatting:
ESLint: JavaScript linting tool to enforce code quality and consistency.
Prettier: Code formatter to maintain a consistent style.
Testing:
Postman: API testing and debugging tool to verify endpoints.
GitHub Actions: Continuous integration to ensure all tests and linting pass.
Other Tools and Techniques:
RESTful Design Principles: For structured and consistent API design.
Environment Variables: Used for configuration, including JWT secrets and port numbers.
CORS: For cross-origin resource sharing to allow frontend-backend interaction.
How to Run the Project
Install Dependencies:

bash
Copy code
npm install
Set Up Environment Variables: Create a .env file in the project root and add the following:

plaintext
Copy code
PORT=3001
JWT_SECRET=your_secret_key_here
Start MongoDB: Ensure MongoDB is running locally or configure your connection string in the project.

Run the Project:

bash
Copy code
npm start
Run in Development Mode:

bash
Copy code
npm run dev
API Endpoints
Authentication
POST /signup: Register a new user.
POST /signin: Authenticate an existing user and receive a token.
Users
GET /users/me: Retrieve the logged-in user's profile.
PATCH /users/me: Update the logged-in user's profile (name and avatar).
Clothing Items
GET /items: Retrieve a list of clothing items.
POST /items: Create a new clothing item (requires authentication).
DELETE /items/:itemId: Delete a clothing item (only the owner can delete it).
PUT /items/:itemId/likes: Like a clothing item.
DELETE /items/:itemId/likes: Dislike a clothing item.
Testing and Linting
Run Tests:
bash
Copy code
npm test
Run ESLint:
bash
Copy code
npx eslint .

```

```
