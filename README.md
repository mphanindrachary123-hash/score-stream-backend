A backend API built using Node.js, Express, and MySQL, providing cricket match data, user authentication, OTP verification, password reset, and admin-protected routes.

**Features**
User Features

    User Signup with full validation
    
    Secure Login using JWT
    
    Email OTP verification
    
    Password reset using OTP
    
    Refresh token support
    
    Strong password policies
    
    Duplicate checks (username, email, mobile)
Cricket Match Features

    Fetch live cricket match data
    
    API integration with CricAPI

Admin Features

    Admin-only protected dashboard route
    
    Role-based authentication
**Folder Structure**

        score-stream-backend/
        │
        ├── controllers/
        │   ├── authController.js
        │   ├── matchController.js
        │   ├── userController.js
        │   └── adminController.js
        │
        ├── routes/
        │   ├── authRoutes.js
        │   ├── matchRoutes.js
        │   ├── userRoutes.js
        │   └── adminRoutes.js
        │
        ├── middleware/
        │   ├── authMiddleware.js
        │   ├── isAdminMiddleware.js
        │   ├── validation.js
        │   └── validateRequest.js
        │
        ├── models/
        │   └── userModel.js
        │
        ├── utils/
        │   ├── generateOtp.js
        │   └── mailer.js
        │
        ├── app.js
        ├── index.js
        ├── .env
        └── package.json

**Installation and Setup**

**Clone the Repository**

    git clone https://github.com/your-username/score-stream-backend.git
    cd score-stream-backend

**Install Dependencies**

    npm install

**Configure Environment Variables**
Create a .env file:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=score
    
    ACCESS_TOKEN_SECRET=your_jwt_secret
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password
    
    CRICAPI_TOKEN=your_cricapi_key
    PORT=3000

**Setup MySQL Database**

Run these SQL commands:

    CREATE DATABASE score;
    USE score;
    
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        username VARCHAR(100) UNIQUE,
        email VARCHAR(200),
        password_hash VARCHAR(255),
        mobile_number VARCHAR(20),
        is_admin BOOLEAN DEFAULT FALSE
    );


Also create tables for OTP + refresh tokens:

    CREATE TABLE email_verifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(200),
        otp VARCHAR(10),
        expires_at DATETIME
    );
    
    CREATE TABLE password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(200),
        otp VARCHAR(10),
        expires_at DATETIME
    );
    
    CREATE TABLE refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100),
        token TEXT,
        expires_at DATETIME
    );

**Run the Server**

    npm run dev
