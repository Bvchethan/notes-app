 Library Notes App

A full-stack Notes application that allows users to securely create, view, and delete notes with JWT-based authentication
Tech Stack

Frontend
* React.js
* Fetch API
* 
 Backend
* Spring Boot (Java)
* REST APIs
* JWT Authentication
* 
Database
* PostgreSQL (Render Cloud)
Deployment
* Render (Frontend + Backend + DB)
* 
Environment
* Linux (WSL Ubuntu)
* Docker (for backend)

 Features
*  Secure login using JWT
*  Create notes
*  View notes
*  Delete notes
*  Persistent storage using PostgreSQL
*  Fully deployed on cloud
  
  How It Works

1. User logs in and receives a JWT token
2. Token is stored in localStorage
3. All API requests include Authorization header
4. Backend validates token before processing requests
5. 
 Setup Instructions

Clone repo
git clone https://github.com/your-username/notes-app.git
cd notes-app
Backend setup (Spring Boot)

* Add environment variables:
DB_URL=your_db_url
DB_USER=your_db_user
DB_PASS=your_db_password
APP_USER=your_username
APP_PASS=your_password

* Run:
./mvnw spring-boot:run

Frontend setup (React)
cd notes-frontend
npm install
npm start
 Environment Vari
 ables

| Variable | Description               |
| -------- | ------------------------- |
| DB_URL   | PostgreSQL connection URL |
| DB_USER  | Database username         |
| DB_PASS  | Database password         |
| APP_USER | Login username            |
| APP_PASS | Login password            |


Deployment
* Backend deployed using Docker on Render
* Frontend deployed as Static Site on Render
* PostgreSQL managed by Render

 Future Improvements

* Multi-user support
*  Signup system
*  Password hashing (bcrypt)
*  UI enhancements
*  Mobile responsiveness
Author
Built by **Chethan** 
