# StayNest — Hotel Booking Web App

StayNest is a full-stack hotel booking web application developed as a capstone project.

The application is being built with a modern React frontend, Node.js/Express backend, PostgreSQL database, and Prisma ORM. The goal is to provide a complete hotel discovery and booking experience including hotel search, filtering, authentication, room availability, reservations, reviews, and booking management.

---

## 🚧 Project Status

**Status:** In Development

The project is being developed incrementally in multiple development batches.

### Current Progress

- ✅ Frontend foundation completed
- ✅ Hotel discovery interface completed
- ✅ Search and filtering functionality implemented
- ✅ Node.js + Express backend initialized
- ✅ PostgreSQL database created
- ✅ Prisma ORM configured
- ✅ Prisma 7 configuration completed
- 🔄 Database schema development
- ⏳ User authentication
- ⏳ Hotel and room management
- ⏳ Booking system
- ⏳ Reviews and ratings
- ⏳ Admin functionality
- ⏳ Deployment

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- REST API
- CORS
- dotenv

### Database

- PostgreSQL
- Prisma ORM
- pgAdmin

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 📁 Project Structure

```text
hotel-booking-app/
│
├── client/                     # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── prisma/
│   │   └── schema.prisma       # Prisma database schema
│   │
│   ├── src/
│   │   ├── controllers/        # Request/controller logic
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utility functions
│   │   └── server.js           # Express server entry point
│   │
│   ├── .env                    # Local environment variables
│   ├── package.json
│   ├── prisma7.config.ts       # Prisma configuration
│   └── tsconfig.json
│
├── .gitignore
├── README.md
└── ...
```

✨ Planned Features
User Features
User registration and login
Secure authentication
Hotel search
Search by destination
Hotel filtering
Sorting
Hotel details
Room availability
Room selection
Hotel booking
Booking confirmation
View booking history
Cancel bookings
Submit hotel reviews and ratings
Admin Features
Admin authentication
Add and manage hotels
Add and manage rooms
Update room availability
View bookings
Manage users
Manage hotel reviews
🗄️ Database

The application uses PostgreSQL as its relational database and Prisma ORM for database access and schema management.

The local development database is:

Database: staynest
Host: localhost
Port: 5432
Schema: public

The database will contain entities such as:

User
Hotel
Room
Booking
Review

and their corresponding relationships.

The database is managed primarily through pgAdmin during development.

🔌 Application Architecture
┌──────────────────────────────┐
│ React + Vite │
│ Frontend Application │
│ localhost:5173 │
└──────────────┬───────────────┘
│
│ HTTP / REST API
▼
┌──────────────────────────────┐
│ Node.js + Express │
│ Backend │
│ localhost:5000 │
└──────────────┬───────────────┘
│
│ Prisma ORM
▼
┌──────────────────────────────┐
│ PostgreSQL │
│ localhost:5432 │
│ staynest │
└──────────────────────────────┘
⚙️ Local Development Setup

1. Clone the repository
   git clone <repository-url>
   cd hotel-booking-app
2. Install frontend dependencies
   cd client
   npm install

Start the frontend:

npm run dev

The frontend runs on:

http://localhost:5173 3. Install backend dependencies

Open another terminal and navigate to:

cd server

Install dependencies:

npm install

Start the backend:

npm run dev

The backend runs on:

http://localhost:5000
🔐 Environment Variables

The backend requires a local .env file.

Create:

server/.env

Example:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/staynest"
PORT=5000

Replace YOUR_PASSWORD with the local PostgreSQL password.

Important: .env contains sensitive database credentials and must never be committed to GitHub.

🧬 Prisma

Prisma is used as the ORM for the PostgreSQL database.

The project currently uses Prisma 7.

Prisma configuration is stored in:

server/prisma7.config.ts

The Prisma schema is stored in:

server/prisma/schema.prisma

Prisma commands should be executed from the server directory.

Example:

npx prisma db pull

Database migrations will be introduced as the application schema is developed.

🌿 Git Workflow

Development is organized into incremental checkpoints.

Each major development batch is committed and pushed to GitHub so that the project maintains a clear development history.

Example:

git status
git add .
git commit -m "feat: initialize backend and database foundation"
git push
📌 Development Roadmap
Phase 1 — Frontend Foundation
Project initialization
UI architecture
Navigation
Hotel discovery
Search
Filtering
Sorting
Phase 2 — Backend & Database
Express server
REST API structure
PostgreSQL setup
Prisma configuration
Database schema
Phase 3 — Authentication
User registration
Login
Password hashing
JWT authentication
Protected routes
Phase 4 — Hotel & Room Management
Hotel APIs
Room APIs
Hotel details
Room availability
Phase 5 — Booking System
Booking creation
Availability validation
Booking confirmation
Booking history
Booking cancellation
Phase 6 — Reviews & Ratings
Submit reviews
Ratings
Review management
Phase 7 — Admin Dashboard
Hotel management
Room management
User management
Booking management
Phase 8 — Testing & Deployment
API testing
Frontend testing
Security improvements
Production configuration
Deployment
👨‍💻 Development

StayNest is being developed as a full-stack web application with a focus on clean architecture, maintainable code, relational database design, RESTful APIs, and a responsive user experience.

📄 License

This project is developed for educational and portfolio purposes.

---

# 2. Check the final project structure

Before Git, your important structure should now look like:

```text
hotel-booking-app/
│
├── .gitignore                 ✅
├── README.md                  ✅
│
├── client/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── server/
    ├── prisma/
    │   └── schema.prisma
    │
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   └── server.js
    │
    ├── .env                   🔒 ignored
    ├── node_modules/          🔒 ignored
    ├── package.json
    ├── package-lock.json
    ├── prisma7.config.ts
    └── tsconfig.json
```
