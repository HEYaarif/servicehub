# 🚀 ServiceHub - Service Marketplace

A full-stack **Service Marketplace** web application built using the **MERN Stack**. ServiceHub connects customers with trusted service providers, allowing users to discover, book, and manage professional home services through a secure, role-based platform.

---

## 📌 Project Overview

ServiceHub is a marketplace where:

- 👤 Customers can browse and book services.
- 🏪 Vendors can register and offer their services.
- 🛡️ Admins manage vendors, users, services, and bookings.

The application follows a **role-based authentication system** with secure JWT authentication and an admin approval workflow for vendors.

---

## ✨ Features

### 🔐 Authentication
- JWT Authentication
- Access Token & Refresh Token
- Password Encryption (bcrypt)
- Role-Based Login
- Protected Routes
- Secure Logout

### 👤 Customer
- Register & Login
- Browse Services
- Search Services
- Book Services
- View Booking History
- Manage Profile

### 🏪 Vendor
- Vendor Registration
- Pending Approval Workflow
- Vendor Dashboard
- Manage Services
- View Bookings
- Update Profile

### 🛡️ Admin
- Admin Dashboard
- Vendor Approval / Rejection
- User Management
- Service Management
- Category Management
- Booking Management
- Dashboard Analytics

---

# 🏗️ Tech Stack

## Frontend

- React.js
- React Router DOM
- Tailwind CSS
- Axios
- React Icons

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser
- CORS

---

# 📁 Project Structure

```
ServiceHub
│
│   ├── public
│   └── src
│       ├── admin
│       ├── api
│       ├── components
│       ├── pages
│       ├── assets
│       └── App.jsx
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed
│   ├── utils
│   ├── app.js
│   └── .env
│
└── README.md
```

---

# 👥 User Roles

## 👤 Customer

- Register/Login
- Browse Services
- Book Services
- Track Bookings

---

## 🏪 Vendor

- Register as Vendor
- Wait for Admin Approval
- Add/Edit/Delete Services
- View Customer Bookings

---

## 🛡️ Admin

- Approve Vendors
- Reject Vendors
- Manage Users
- Manage Categories
- Manage Services
- View Bookings
- Monitor Platform Activity

---

# 🔄 Vendor Approval Flow

```
Vendor Signup
      │
      ▼
Status = PENDING
      │
      ▼
Admin Dashboard
      │
      ▼
Approve / Reject
      │
      ├── ACTIVE
      └── REJECTED
```

---

# 🔑 Authentication Flow

```
Signup

↓

Login

↓

Access Token + Refresh Token

↓

Protected Routes

↓

Logout
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/HEYaarif/servicehub.git
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run dev
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRE=15m

REFRESH_TOKEN_EXPIRE=7d
```

---

# 📸 Screenshots

- Home Page
- Login
- Signup
- Admin Dashboard
- Vendor Dashboard
- Customer Dashboard

*(Add screenshots after completing the project.)*

---

# 🚧 Future Enhancements

- Online Payment Gateway
- Email Notifications
- Image Upload
- Ratings & Reviews
- Wishlist
- Real-time Booking Updates
- Google Authentication
- Service Recommendations

---

# 🧑‍💻 Developer

**Md Aarif**

- MERN Stack Developer
- JavaScript | React | Node.js | Express | MongoDB

---

# 📄 License

This project is developed for educational and assessment purposes.
