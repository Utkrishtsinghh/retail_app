# Foodie Ordering System 🍕🥤

A full-stack food ordering application built with **Angular (v17+)** and **.NET 8 (C# Web API)**. The application features a robust customer shopping cart, order tracking, JWT-based authentication, and a dedicated Admin Dashboard. 

## 📦 Prerequisites
If someone is downloading this project to their local machine, they MUST install the following software first:

1. [Node.js](https://nodejs.org/) (v18 or newer) - *Required for the Angular Frontend (npm).*
2. [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) - *Required for compiling and running the C# API.*
3. A code editor like [Visual Studio Code](https://code.visualstudio.com/).

---

## 🚀 Steps to Run the Project

You must run both the Backend API and the Frontend UI simultaneously in two separate terminals.

### 1. Start the Backend API (Terminal 1)
The backend uses **SQLite** + **Entity Framework Core**. It is configured to automatically build its own database and seed the menu items (Pizza, Garlic Bread, etc.) on the first run.

1. Open a terminal and navigate to the `Backend` folder:
   ```bash
   cd Backend
   ```
2. Run the .NET application:
   ```bash
   dotnet run
   ```
3. *Expected outcome:* The API will restore its packages, build successfully, and start listening on **`http://localhost:5196`**. Keep this terminal open!

### 2. Start the Frontend UI (Terminal 2)
The frontend is a modern, standalone Angular 17 application. 

1. Open a *new* terminal and navigate to the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. *Expected outcome:* The Angular server will compile the UI and host it on **`http://localhost:4200`**.

---

## 🎮 How to Use the App

Open your browser and navigate to **`http://localhost:4200`**.

* **For Customers:** 
  Click **Register** in the top right to create a new user account. Once logged in, you can add food items to your cart, specify a delivery address, checkout, and view your Order History.
  
* **For Administrators:** 
  Go to the **Login** page. Type `admin` into the username box, `admin` into the password box, and click the blue **"Admin login? Click here"** link at the bottom of the card. This will grant you access to the Admin Dashboard where you can track total revenue (in INR ₹), view system-wide stats, and update the status of customer orders!
