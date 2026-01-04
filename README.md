# Web 2 Midterm Project - Role-Based Content Management System

A full-stack RBAC (Role-Based Access Control) content management system built with Angular and Node.js, featuring article management with granular permissions.

## 🌟 Live Demo

- **Frontend**: https://web-2-midterm.vercel.app/
- **Backend**: https://web-2-midterm.onrender.com

> **⚠️ Important Note on Render Free Tier**: The backend is deployed on Render's free tier, which automatically shuts down after periods of inactivity. The first request after idle time may take 30-60 seconds to wake up the server. Subsequent requests will be fast.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Roles & Permissions](#user-roles--permissions)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Known Issues & Solutions](#known-issues--solutions)
- [Contributing](#contributing)

## ✨ Features

### Authentication & Authorization

- 🔐 JWT-based authentication with access and refresh tokens
- 👥 Role-Based Access Control (RBAC) with four predefined roles
- 🛡️ Protected routes with permission guards
- 🔄 Automatic role assignment if user's role is deleted (defaults to Viewer)

### Article Management

- 📝 Create, Read, Update, Delete (CRUD) operations
- 📊 Draft and publish functionality
- 🖼️ Optional image support for articles
- 📱 Responsive article list with filtering

### Role & Permission Management

- ⚙️ SuperAdmin-only role creation and management
- 🔒 Granular permission system (create, edit, delete, publish, view)
- 📊 Access matrix visualization
- 🎯 Permission-based UI rendering

### User Experience

- 🎨 Modern UI with Tailwind CSS
- ⚡ Real-time loading states with spinners
- 🔔 Success/error notifications
- 📱 Fully responsive design
- 🎯 Empty state handling
- 🔍 HTTP request logging with Morgan

## 🛠️ Tech Stack

### Frontend

- **Framework**: Angular 21.0.0
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS v3
- **Build Tool**: Vite
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS with BehaviorSubject
- **Routing**: Angular Router with lazy loading

### Backend

- **Runtime**: Node.js v24.8.0
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.1.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **CORS**: cors 2.8.5
- **Logging**: morgan 1.10.0
- **Environment**: dotenv 17.2.3

### Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB account (for MongoDB Atlas)
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd web-2-midterm-project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_access_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
```

Seed the database with initial roles and permissions:

```bash
npm run seed
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api", // For local development
};
```

## 🔐 Environment Variables

### Backend (.env)

| Variable           | Description                 | Required |
| ------------------ | --------------------------- | -------- |
| PORT               | Server port (default: 5000) | Yes      |
| MONGO_URI          | MongoDB connection string   | Yes      |
| JWT_ACCESS_SECRET  | Secret for access tokens    | Yes      |
| JWT_REFRESH_SECRET | Secret for refresh tokens   | Yes      |

### Frontend (environment.ts / environment.prod.ts)

| Variable   | Description          |
| ---------- | -------------------- |
| production | Production mode flag |
| apiUrl     | Backend API base URL |

## 🏃 Running the Application

### Development Mode

**Backend (Terminal 1):**

```bash
cd backend
npm run dev
# or
node server.js
```

**Frontend (Terminal 2):**

```bash
cd frontend
npm start
# or
ng serve
```

Access the application at `http://localhost:4200`

### Production Build

**Frontend:**

```bash
cd frontend
npm run build
```

The build artifacts will be stored in `dist/frontend/browser/`

## 📁 Project Structure

```
web-2-midterm-project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── articleController.js  # Article CRUD operations
│   │   ├── authController.js     # Authentication & registration
│   │   ├── permissionController.js
│   │   ├── roleController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── Article.js
│   │   ├── Permission.js
│   │   ├── Role.js
│   │   └── User.js
│   ├── routes/
│   │   ├── articles.js
│   │   ├── auth.js
│   │   ├── permissions.js
│   │   ├── roles.js
│   │   └── users.js
│   ├── utils/
│   │   └── jwt.js                # JWT token generation
│   ├── .env
│   ├── app.js                    # Express app configuration
│   ├── seed.js                   # Database seeding script
│   ├── server.js                 # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── articles/
    │   │   │   ├── components/
    │   │   │   │   ├── article-list/
    │   │   │   │   ├── article-create/
    │   │   │   │   └── article-edit/
    │   │   │   └── services/
    │   │   │       └── article.service.ts
    │   │   ├── auth/
    │   │   │   ├── components/
    │   │   │   │   ├── login/
    │   │   │   │   └── register/
    │   │   │   └── services/
    │   │   │       └── auth.service.ts
    │   │   ├── core/
    │   │   │   ├── components/
    │   │   │   │   ├── navbar/
    │   │   │   │   └── unauthorized/
    │   │   │   ├── guards/
    │   │   │   │   ├── auth.guard.ts
    │   │   │   │   ├── permission.guard.ts
    │   │   │   │   └── super-admin.guard.ts
    │   │   │   ├── interceptors/
    │   │   │   │   ├── auth.interceptor.ts
    │   │   │   │   └── error.interceptor.ts
    │   │   │   └── models/
    │   │   ├── permissions/
    │   │   │   └── components/
    │   │   │       └── permission-list/
    │   │   └── roles/
    │   │       └── components/
    │   │           ├── role-list/
    │   │           └── access-matrix/
    │   ├── environments/
    │   │   ├── environment.ts
    │   │   └── environment.prod.ts
    │   └── styles.css
    ├── angular.json
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── vercel.json
```

## 👥 User Roles & Permissions

### Role Hierarchy

| Role            | Permissions                         | Description                                  |
| --------------- | ----------------------------------- | -------------------------------------------- |
| **SuperAdmin**  | create, edit, delete, publish, view | Full system access including role management |
| **Manager**     | create, edit, publish, view         | Can manage content and publish articles      |
| **Contributor** | create, edit, view                  | Can create and edit own content              |
| **Viewer**      | view                                | Read-only access to published articles       |

### Permission Breakdown

- **create**: Create new articles
- **edit**: Edit existing articles
- **delete**: Delete articles
- **publish**: Publish/unpublish articles
- **view**: View articles

### Default Test Users (after seeding)

| Email                | Password    | Role        |
| -------------------- | ----------- | ----------- |
| superadmin@test.com  | password123 | SuperAdmin  |
| manager@test.com     | password123 | Manager     |
| contributor@test.com | password123 | Contributor |
| viewer@test.com      | password123 | Viewer      |

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login user
POST   /api/auth/refresh-token   # Refresh access token
```

### Articles

```
GET    /api/articles             # Get all articles (filtered by permissions)
GET    /api/articles/:id         # Get single article
POST   /api/articles             # Create article (requires 'create' permission)
PUT    /api/articles/:id         # Update article (requires 'edit' permission)
DELETE /api/articles/:id         # Delete article (requires 'delete' permission)
PUT    /api/articles/:id/publish # Publish/unpublish (requires 'publish' permission)
```

### Roles

```
GET    /api/roles                # Get all roles (public for registration)
GET    /api/roles/access-matrix  # Get roles with permissions
POST   /api/roles                # Create role (SuperAdmin only)
PUT    /api/roles/:id            # Update role (SuperAdmin only)
DELETE /api/roles/:id            # Delete role (SuperAdmin only)
```

### Permissions

```
GET    /api/permissions          # Get all permissions
```

### Users

```
GET    /api/users                # Get all users (authenticated)
GET    /api/users/:id            # Get user by ID (authenticated)
PUT    /api/users/:id            # Update user (authenticated)
DELETE /api/users/:id            # Delete user (SuperAdmin only)
```

## 🚀 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add all variables from `.env`
4. Deploy

**Important**: On Render's free tier, the server spins down after 15 minutes of inactivity. The first request may take 30-60 seconds to wake it up.

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Update `src/environments/environment.prod.ts` with production API URL
4. Run: `vercel`
5. Follow the prompts

**vercel.json Configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/frontend/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🐛 Known Issues & Solutions

### Issue: Spinner Keeps Spinning After API Response

**Solution**: Implemented `ChangeDetectorRef` in all components with loading states to manually trigger Angular change detection after async operations complete.

### Issue: User's Role Deleted - Cannot Login

**Solution**: Backend automatically assigns the "Viewer" role (most basic permissions) if a user's role is deleted.

### Issue: 404 Errors on Vercel Deployment

**Solution**: Updated `vercel.json` with correct `outputDirectory` pointing to `dist/frontend/browser` for Angular 17+.

### Issue: CORS Errors

**Solution**: Backend has CORS enabled. Ensure the frontend URL is allowed in production.

### Issue: Render Server Cold Start

**Solution**: This is expected behavior on the free tier. The first request after idle time will be slow (~30-60s). Consider:

- Implementing a loading message explaining the cold start
- Using a paid plan for production
- Pinging the server periodically to keep it warm

## 🔧 Development Tips

### Running with Morgan Logging

The backend uses Morgan for HTTP request logging in development:

```
GET /api/articles 200 12.456 ms - 428
POST /api/auth/login 200 145.234 ms - 512
```

### Database Seeding

To reset and reseed the database:

```bash
cd backend
node seed.js
```

This creates:

- 5 permissions: create, edit, delete, publish, view
- 4 roles: SuperAdmin, Manager, Contributor, Viewer
- 4 test users (one for each role)

### Clearing Angular Cache

If you encounter build issues:

```bash
cd frontend
rm -rf .angular/cache
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

## 📝 License

This project is created for educational purposes as part of a Web Development course midterm project.

## 👨‍💻 Author

Created for Web 2 Midterm Project - 2026

---

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Express.js community
- MongoDB for the database solution
- Tailwind CSS for the utility-first CSS framework
- Render and Vercel for hosting services

---

**Note**: This is a student project. For production use, ensure proper security measures, environment configuration, and error handling are in place.
