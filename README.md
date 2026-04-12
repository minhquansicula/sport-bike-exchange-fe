# VeloX - Sport Bike Exchange (Frontend)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

VeloX is a Customer-to-Customer (C2C) e-commerce platform integrated with offline event management, specifically designed for the sport cycling community. The platform resolves trust issues in second-hand trading through a physical inspection workflow, an internal e-wallet system, and a secure deposit/payment process.

This repository contains the Frontend source code of the project, built as a Single Page Application (SPA).

## Key Features

* **Multi-flow Authentication:** Login/Register via the internal account system (JWT) and Google OAuth2.
* **Strict Role-Based Access Control (RBAC):** Interfaces and functionalities are customized based on user roles (Guest, Buyer/Seller, Inspector, Admin).
* **Smart Transaction Management:** A comprehensive dashboard to track transaction lifecycles (Waiting for Payment, Deposited, Scheduled, Inspection Failed, Refunded, Compensated).
* **Internal Wallet & VNPay Integration:** Top-up the system wallet and make direct payments via the VNPay Sandbox gateway.
* **Offline Event Registration:** Register currently listed bikes or create new bikes for offline events to be inspected by a team of experts.
* **Upload & Image Management:** Integrated with Cloudinary to optimize the storage and delivery of bicycle images.
* **Modern UI/UX:** 100% responsive design utilizing Tailwind CSS, optimized for seamless experiences across both Mobile and Desktop devices.

## Tech Stack

* **Core:** React.js 
* **Styling:** Tailwind CSS
* **Routing:** React Router Dom
* **HTTP Client:** Axios (Integrated with interceptors to automatically attach JWT tokens)
* **State Management:** React Hooks (useState, useEffect, useContext)
* **Icons & UI Feedback:** React Icons, React Hot Toast
* **Build Tool:** Vite (or Create React App depending on your configuration)

## Local Development Guide

### Prerequisites
* Node.js (Version v16.x or higher)
* npm or yarn

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/velox-frontend.git](https://github.com/your-username/velox-frontend.git)
    cd velox-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables**
    Create a `.env` file in the root directory of the project and configure the connection parameters to the Backend:
    ```env
    # Example if using Vite
    VITE_API_BASE_URL=http://localhost:8080/api
    VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
    
    # Example if using Create React App
    REACT_APP_API_BASE_URL=http://localhost:8080/api
    REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be running at `http://localhost:5173` (or `http://localhost:3000`).

## Folder Structure

```text
src/
├── assets/            # Static images, logos, fonts
├── components/        # Reusable UI Components (Button, Modal, Input, Navbar, Footer...)
├── contexts/          # React Contexts (AuthContext, ThemeContext...)
├── hooks/             # Custom React Hooks (useAuth, useFetch...)
├── layouts/           # Main layout structures (MainLayout, AdminLayout...)
├── pages/             # Page views (Home, Login, Dashboard, TransactionManage...)
├── services/          # API call services using Axios (authService.js, bikeService.js...)
├── utils/             # Shared utility functions (formatCurrency.js, validate.js...)
├── App.jsx            # Main Application Routing configuration
└── main.jsx           # React Entry point
