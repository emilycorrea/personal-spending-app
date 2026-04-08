# 💸 Personal Spending Tracker

## 📌 Description

Personal Spending Tracker is a full-stack personal finance application that helps users track, organize, and analyze their expenses. Users can manually add transactions or import them from CSV files (such as bank statements). The app cleans and standardizes data, normalizes categories, and provides clear visual insights into spending habits.

---

## 🚀 Live Demo

* Frontend: https://personal-spending-app.vercel.app
* Backend API: https://personal-spending-backend.onrender.com

---

## ✨ Features

* Add, view, and delete expenses
* Import expenses from CSV files
* Automatically normalize categories (e.g., *Dining Out* → *food*)
* Clean and standardize transaction names
* Filter expenses by category
* Sort by date, name, and amount
* Display total spending
* Pie chart visualization of spending by category
* Robust handling of missing or inconsistent data

---

## 🛠️ Tech Stack

**Frontend**

* React (Vite)

**Backend**

* Node.js
* Express

**Database**

* SQLite

**Libraries**

* PapaParse (CSV parsing)
* Recharts (data visualization)

---

## ⚙️ How It Works

The React frontend allows users to add expenses or upload a CSV file. Data is sent to the Express backend through a REST API, where it is cleaned, normalized, and stored in a SQLite database. The processed data is then returned to the frontend for display, filtering, sorting, and visualization.

**Flow:**
Frontend → API → Data Processing → SQLite → Frontend

---

## 🔗 API Endpoints

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| GET    | /expenses         | Retrieve all expenses          |
| GET    | /expenses/summary | Get total spending by category |
| POST   | /expenses         | Add a new expense              |
| DELETE | /expenses/:id     | Delete an expense              |

---

## 🧹 Data Handling

* Dates are normalized into a consistent format for storage
* Dates are displayed in a user-friendly format
* CSV imports support multiple column names (e.g., *Date*, *Transaction Date*)
* Missing or invalid values are handled safely with fallbacks
* Categories are standardized for better filtering and analysis

---

## 🧑‍💻 Local Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/emilycorrea/personal-spending-app.git
cd personal-spending-app
```

### 2. Install frontend dependencies

```
npm install
```

### 3. Install backend dependencies

```
cd backend
npm install
```

### 4. Start the backend server

```
node server.js
```

### 5. Start the frontend

```
npm run dev
```

### 6. Open the app

```
http://localhost:5173
```

---

## 🌍 Deployment

* **Frontend:** Deployed on Vercel
* **Backend:** Deployed on Render
* **Database:** SQLite (file-based)

> ⚠️ Note: On Render's free tier, the SQLite database is ephemeral and may reset after inactivity or redeployment.

---

## 🔮 Future Improvements

* Edit existing expenses
* Budget tracking and alerts
* Recurring expenses
* Advanced analytics (monthly trends, comparisons)
* User authentication
* Migration to a persistent cloud database (PostgreSQL)

---

## 👤 Author

**Emily Correa**
GitHub: https://github.com/emilycorrea

---

## 📄 License

This project is licensed under the MIT License.
