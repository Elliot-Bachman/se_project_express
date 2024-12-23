# WTWR Backend (What to Wear)

This is the backend service for the **WTWR (What to Wear)** project. It is designed to handle requests for managing users and clothing items in the application, including creating, reading, updating, and deleting (CRUD) functionality. The backend interacts with a MongoDB database to persist data and follows modern RESTful API design principles.

---

## Project Functionality

The backend provides the following features:

- **User Management:**

  - Retrieve a list of users.
  - Create a new user.
  - Retrieve a specific user by ID.

- **Clothing Item Management:**

  - Retrieve a list of clothing items.
  - Create a new clothing item.
  - Delete a clothing item by ID.
  - Like or dislike a clothing item.

- **Error Handling:**
  - Handling of invalid routes, invalid data, and server errors.
  - Proper status codes and descriptive error messages.

---

## Technologies Used

This project is built with the following technologies:

### Backend Framework:

- **[Express.js](https://expressjs.com/):** Fast and lightweight web application framework for Node.js.

### Database:

- **[MongoDB](https://www.mongodb.com/):** NoSQL database for storing users and clothing items.
- **[Mongoose](https://mongoosejs.com/):** Object Data Modeling (ODM) library for MongoDB and Node.js.

### Linting and Code Formatting:

- **[ESLint](https://eslint.org/):** JavaScript linting tool to enforce code quality and consistency.
- **[Prettier](https://prettier.io/):** Code formatter to maintain a consistent style.

### Testing:

- **[Postman](https://www.postman.com/):** API testing and debugging tool to verify endpoints.
- **GitHub Actions:** Continuous integration to ensure all tests and linting pass.

### Other Tools and Techniques:

- **RESTful Design Principles:** For structured and consistent API design.
- **Environment Variables:** Used for configuration, including setting up the port.

---

## How to Run the Project

1. **Install Dependencies:**
   ```bash
   npm install
   ```
