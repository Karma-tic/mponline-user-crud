# MPOnline Secure User CRUD
# MPOnline Secure User Management System

A **secure, production-ready CRUD application** built for government use case (like MPOnline Portal).

![MPOnline Banner](https://your-image-link-here.jpg)

## 🚀 Features

- **Secure Backend** with FastAPI
- **Modern Frontend** with React + TypeScript
- **Strong Validation** on both Frontend & Backend (Zod + Pydantic)
- **PostgreSQL** Database
- **Rate Limiting** & Security Best Practices
- **Government Standard UI/UX**
- Fully Responsive Design

## 🛠 Tech Stack

### Backend
- **FastAPI** (Python)
- **SQLAlchemy 2.0** + PostgreSQL
- **Pydantic v2** for validation
- **CORS** & Security Headers

### Frontend
- **React 18** + TypeScript
- **Vite**
- **Tailwind CSS**
- **React Hook Form + Zod**
- **Lucide React** Icons

## 📸 Screenshots

*(Yahan apni screenshots daal dena)*

![Dashboard][Screenshot 2026-05-17 at 11.40.30 PM.png](https://raw.githubusercontent.com/Karma-tic/mponline-user-crud/main/screenshots/Screenshot 2026-05-17 at 11.40.30 PM.png)
![Form Validation](screenshot-2.png)

## 🏗 Project Structure

mponline-user-crud/
├── backend/              # FastAPI Backend
│   ├── app/
│   ├── main.py
│   └── requirements.txt
├── frontend/             # React Frontend
│   ├── src/
│   └── vite.config.ts
└── README.md

## 🚀 How to Run Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
python main.py

cd frontend
npm install
npm run dev

🔒 Security Features

Input validation on both ends
SQL Injection Protected
Rate Limiting
Unique constraints (Email & Phone)
Proper error handling
CORS configured

📌 Future Enhancements

JWT Authentication
Edit User Feature
Search & Pagination
Docker Support
Admin Dashboard


Made with ❤️ for Learning Government Grade Development
