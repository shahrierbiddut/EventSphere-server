# EventSphere - Backend Server

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=flat-square&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-13AA52?style=flat-square&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-FFA500?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square)

EventSphere is a modern and powerful backend server for an event management and booking platform. It provides REST APIs that handle the complete event lifecycle - from event creation to bookings.

---

## 🌐 Live API Endpoint

- **Production Server:** [https://eventsphere-api.vercel.app](https://eventsphere-api.vercel.app)
- **API Base URL:** `https://eventsphere-api.vercel.app/api`

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- **JWT-based User Authentication**
  - Secure token-based login and sign up
  - Token refresh mechanism
  - Password encryption (BCrypt)

- **Role-Based Access Control (RBAC)**
  - User (regular users)
  - Admin (administrators)

### 📅 Event Management

- Complete Event CRUD operations
- Event category system
- Event search and filtering
- Event status tracking (Draft, Pending, Approved, Rejected)

### 🎟️ Booking System

- Event booking management
- Seat management and decrement
- Booking cancellation support
- Booking status tracking

### 📝 Blog & FAQ System

- Blog post management
- Frequently Asked Questions (FAQ) API
- Comment and rating system

### ⭐ Review & Rating

- Event review submission
- Rating system (1-5 stars)
- Review moderation

### 📊 Admin Dashboard Analytics

- Real-time event statistics
- Booking analytics data
- User activity reports
- Custom analytics endpoints

### 🌱 Database Seeding

- Automatic data seeding script
- Demo events, users, and booking data
- Admin account auto-setup

---

## 🛠️ Tech Stack

| Category             | Technology           |
| -------------------- | -------------------- |
| **Runtime**          | Node.js 18+          |
| **Framework**        | Express.js 5.x       |
| **Language**         | TypeScript 5.x       |
| **Database**         | MongoDB 7.x          |
| **ODM**              | Mongoose             |
| **Authentication**   | JWT (JSON Web Token) |
| **Password Hashing** | BCrypt               |
| **CORS**             | CORS middleware      |
| **Environment**      | dotenv               |
| **Development**      | Nodemon, ts-node     |

---

## 📦 Environment Variables Configuration

Create a `.env` file in your project root before running the server:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/eventsphere
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventsphere

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRY=7d

# Admin Credentials (Initial setup)
ADMIN_EMAIL=admin@eventsphere.com
ADMIN_PASSWORD=Admin@123456
```

---

## 🚀 Installation & Local Setup

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- MongoDB (local or MongoDB Atlas account)

### Step 1: Clone the Repository

```bash
git clone https://github.com/shahrierbiddut/EventSphere-server.git
cd EventSphere-server
```

### Step 2: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or npm
npm install

# Or yarn
yarn install
```

### Step 3: Setup Environment Variables

```bash
# Create .env file and fill it according to the template above
cp .env.example .env
```

### Step 4: Verify MongoDB Connection

- If using local MongoDB, ensure MongoDB is running
- Or add MongoDB Atlas URI to `.env`

### Step 5: Database Seeding (Optional)

```bash
# For automatic data seeding
pnpm seed
# Or
npm run seed
```

### Step 6: Start Development Server

```bash
pnpm dev
# Or
npm run dev
```

Server is now running at `http://localhost:5000`.

### Step 7: Production Build (Optional)

```bash
# Compile TypeScript
pnpm build

# Run in production mode
pnpm start
```

---

## 📚 API Routes & Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register` | Register new user        | ❌            |
| POST   | `/api/auth/login`    | User login               | ❌            |
| GET    | `/api/auth/profile`  | Get current user profile | ✅            |
| PUT    | `/api/auth/profile`  | Update profile           | ✅            |

### Event Routes (`/api/events`)

| Method | Endpoint          | Description                      | Auth Required |
| ------ | ----------------- | -------------------------------- | ------------- |
| GET    | `/api/events`     | Get all events (with pagination) | ❌            |
| GET    | `/api/events/:id` | Get specific event details       | ❌            |
| POST   | `/api/events`     | Create new event                 | ✅            |
| PUT    | `/api/events/:id` | Update event                     | ✅            |
| DELETE | `/api/events/:id` | Delete event                     | ✅            |

### Category Routes (`/api/categories`)

| Method | Endpoint              | Description         | Auth Required |
| ------ | --------------------- | ------------------- | ------------- |
| GET    | `/api/categories`     | Get all categories  | ❌            |
| POST   | `/api/categories`     | Create new category | ✅ Admin      |
| PUT    | `/api/categories/:id` | Update category     | ✅ Admin      |
| DELETE | `/api/categories/:id` | Delete category     | ✅ Admin      |

### Booking Routes (`/api/bookings`)

| Method | Endpoint            | Description         | Auth Required |
| ------ | ------------------- | ------------------- | ------------- |
| GET    | `/api/bookings`     | Get my bookings     | ✅            |
| POST   | `/api/bookings`     | Create new booking  | ✅            |
| GET    | `/api/bookings/:id` | Get booking details | ✅            |
| PUT    | `/api/bookings/:id` | Update booking      | ✅            |
| DELETE | `/api/bookings/:id` | Cancel booking      | ✅            |

### Blog Routes (`/api/blogs`)

| Method | Endpoint         | Description          | Auth Required |
| ------ | ---------------- | -------------------- | ------------- |
| GET    | `/api/blogs`     | Get all blog posts   | ❌            |
| GET    | `/api/blogs/:id` | Get single blog post | ❌            |
| POST   | `/api/blogs`     | Create new blog post | ✅ Admin      |
| PUT    | `/api/blogs/:id` | Update blog post     | ✅ Admin      |
| DELETE | `/api/blogs/:id` | Delete blog post     | ✅ Admin      |

### FAQ Routes (`/api/faqs`)

| Method | Endpoint        | Description    | Auth Required |
| ------ | --------------- | -------------- | ------------- |
| GET    | `/api/faqs`     | Get all FAQs   | ❌            |
| POST   | `/api/faqs`     | Create new FAQ | ✅ Admin      |
| PUT    | `/api/faqs/:id` | Update FAQ     | ✅ Admin      |
| DELETE | `/api/faqs/:id` | Delete FAQ     | ✅ Admin      |

### Admin Routes (`/api/admin`)

| Method | Endpoint                    | Description         | Auth Required |
| ------ | --------------------------- | ------------------- | ------------- |
| GET    | `/api/admin/analytics`      | Dashboard analytics | ✅ Admin      |
| GET    | `/api/admin/users`          | Get all users       | ✅ Admin      |
| PUT    | `/api/admin/users/:id/role` | Change user role    | ✅ Admin      |
| DELETE | `/api/admin/users/:id`      | Delete user         | ✅ Admin      |

---

## 👤 Default Test Credentials

### General User Account

```
Email:    user@example.com
Password: User@123456
Role:     User
```

### Admin Account

```
Email:    admin@eventsphere.com
Password: Admin@123456
Role:     Admin
```

> **Note:** These credentials are for testing purposes only. Always use strong passwords in production.

---

## 📁 Project Structure

```
server/
├── src/
│   ├── index.ts              # Main entry point
│   ├── seed.ts               # Data seeding script
│   ├── config/
│   │   └── db.ts             # MongoDB connection config
│   ├── data/
│   │   ├── seedData.ts       # Seed data
│   │   └── seedEvents.ts     # Event seed data
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification middleware
│   │   └── adminAuth.ts      # Admin check middleware
│   ├── models/
│   │   ├── User.ts           # User schema
│   │   ├── Event.ts          # Event schema
│   │   ├── Booking.ts        # Booking schema
│   │   ├── Category.ts       # Category schema
│   │   ├── Blog.ts           # Blog schema
│   │   ├── FAQ.ts            # FAQ schema
│   │   ├── Review.ts         # Review schema
│   │   └── ContactMessage.ts # Contact message schema
│   ├── routes/
│   │   ├── auth.ts           # Authentication routes
│   │   ├── events.ts         # Event routes
│   │   ├── bookings.ts       # Booking routes
│   │   ├── categories.ts     # Category routes
│   │   ├── blogs.ts          # Blog routes
│   │   ├── faqs.ts           # FAQ routes
│   │   ├── admin.ts          # Admin routes
│   │   └── users.ts          # User routes
│   └── utils/
│       ├── jwt.ts            # JWT helper functions
│       └── seed.ts           # Seeding utility
├── dist/                     # Compiled output
├── .env                      # Environment variables
├── .env.example              # Environment template
├── tsconfig.json             # TypeScript config
├── package.json              # Dependency file
└── README.md                 # This file
```

---

## 🔧 Development Scripts

```bash
# Run in development mode (with Nodemon)
pnpm dev

# Compile TypeScript
pnpm build

# Run in production mode
pnpm start

# Check linting
pnpm lint

# Seed database
pnpm seed
```

---

## 🔐 Security Features

- ✅ **CORS Protection** - Prevent unauthorized access
- ✅ **JWT Authentication** - Secure token-based login
- ✅ **BCrypt Password Encryption** - Password hashing
- ✅ **RBAC** - Role-Based Access Control
- ✅ **Input Validation** - Data sanitization

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**

- Ensure MongoDB server is running
- Or use MongoDB Atlas URI

### JWT Token Error

```
Error: jwt malformed
```

**Solution:**

- Set correct `JWT_SECRET` in `.env` file
- Pass token correctly in header: `Authorization: Bearer <token>`

### Port Already in Use

```
Error: EADDRINUSE: address already in use :::5000
```

**Solution:**

- Change port number in `.env` file
- Or kill the process using the port

---

## 📞 Support & Contact

- **GitHub Issues:** [EventSphere-server Issues](https://github.com/shahrierbiddut/EventSphere-server/issues)
- **Email:** [your-email@example.com]
- **Project Repository:** [EventSphere-server](https://github.com/shahrierbiddut/EventSphere-server)

---

## 📄 License

This project is distributed under the ISC License. See the [LICENSE](LICENSE) file for more details.

---

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- JWT standards and best practices

---

**Last Updated:** July 2024
**Version:** 1.0.0
