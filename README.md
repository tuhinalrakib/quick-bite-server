# QuickBite (Backend Server) - RESTful API Gateway

QuickBite Server is a robust, secure, and production-ready REST API built using Node.js, Express, and MongoDB. It handles core business logic, database operations, JWT token session caching with Redis, user authentication, food menu management, secure order checkout, and payment gateways.

## 🔗 Live URLs
- **Backend API Server:** [https://quick-bite-server-xdlf.onrender.com](https://quick-bite-server-xdlf.onrender.com)
- **Frontend App:** [https://quick-bite-delta-six.vercel.app](https://quick-bite-delta-six.vercel.app)

---

## ✨ Features

- **Robust Authentication & Sessions:**
  - Secure HttpOnly cookie handling for JWTs.
  - Short-lived Access Tokens (1h) and long-lived Refresh Tokens (7d).
  - Caching and checking refresh tokens in Redis to allow token revocation (logout) and prevent replay attacks.
  - Google Access Token ID verification for seamless Google login integrations.
- **Profile Management:** Secure endpoint mapping to fetch credentials, update profile metrics (Name, Phone, Address details), and reset passwords.
- **Food Menu API:** Category routing, search query filtering, and full CRUD support for administrators to manage menu items.
- **Order Pipeline:** Checkout processing, tracking system, and order status updates (Pending, Processing, Delivered, Cancelled).
- **Payment Verification:** PayHere Sandbox integration utilizing cryptographically signed md5 hashes (`PAYHERE_MERCHANT_ID`, `PAYHERE_SECRET`) to authenticate transactions.
- **Image Management:** Integrated Cloudinary for high-performance uploading and hosting of food menu asset images.
- **Role-Based Authorization:** Custom security middleware (`authorizeRoles`) restricting admin panels and dashboard metrics to authorized accounts.

---

## 🛠️ Backend Tech Stack

- **Runtime:** Node.js (ES Modules syntax)
- **Web Server:** Express.js
- **Database:** MongoDB via Mongoose ODM
- **In-Memory Cache:** Redis
- **Security:** jsonwebtoken (JWT), bcryptjs (password hashing), cors, cookie-parser
- **Uploads:** Cloudinary SDK

---

## 📁 Directory & File Layout

For a detailed file-by-file diagram, view [__file__structure__.js](./__file__structure__.js). Key folders include:
- `config/` - Mongoose database server connections.
- `controller/` - API handler functions (auth, food, orders, payments).
- `middlewares/` - Auth verifiers (verifyJWT), role locks, and error handlings.
- `models/` - Database schemas (User, Food, Order).
- `routes/` - Express endpoint mappings.
- `services/` - Redis client initialization and cache querying logic.

---

## 🚀 Running Locally

### 1. Install Packages
Ensure Node.js and Yarn or NPM are installed, then run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root folder of the server:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=<your-mongodb-connection-string>

# JWT Config
JWT_ACCESS_SECRET=<your-access-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>

# Google OAUTH Client
GOOGLE_CLIENT_ID=<your-google-client-id>

# Redis Setup
REDIS_HOST=<your-redis-host>
REDIS_PORT=<your-redis-port>
REDIS_USERNAME=default
REDIS_PASSWORD=<your-redis-password>

# Cloudinary SDK Credentials
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

### 3. Launch Server
```bash
npm start
```
The server will boot up and establish database connection strings on `http://localhost:5000`.
