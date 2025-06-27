WTWR (What to Wear) - Full Stack Project
🌍 Live Demo
Frontend: https://what-to-wear-clothes.jumpingcrab.com/
Backend API: https://api.wtwr-demo.mindhackers.org
📌 Project Overview
WTWR is a full-stack web application that allows users to:
✅ Register and log in securely using JWT authentication.
✅ Add, delete, and like clothing items based on the weather.
✅ Edit their user profile.

The project consists of:

Frontend: React + Vite (deployed on an Nginx server).
Backend: Express.js + MongoDB (deployed with PM2).
Database: MongoDB running on a cloud instance.
⚙️ Technologies Used
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Celebrate (for request validation)
Winston + Morgan (for logging)
PM2 (for process management)
Nginx (for reverse proxy)
Frontend
React.js
Vite.js
CSS Modules
🛠 API Endpoints
📝 Authentication
Method Route Description
POST /signup Register a new user
POST /signin Log in and receive a JWT
👤 Users
Method Route Description
GET /users/me Get current user profile
PATCH /users/me Update user profile
👕 Clothing Items
Method Route Description
GET /items Get all clothing items
POST /items Add a new clothing item (Auth required)
DELETE /items/:id Delete an item (Only if user owns it)
PUT /items/:id/likes Like an item
DELETE /items/:id/likes Unlike an item
🛠 Crash Test (For Debugging)
Method Route Description
GET /crash-test Simulates a server crash
