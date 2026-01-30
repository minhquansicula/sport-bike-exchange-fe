import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Import các Provider
// AuthProvider đã được wrap trong App.jsx rồi, không cần import ở đây nữa
// import { WishlistProvider } from "./context/WishListContext.jsx";
import { CartProvider } from "./context/CartContext";
import { TransactionProvider } from "./context/TransactionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <TransactionProvider>
        <App />
      </TransactionProvider>
    </CartProvider>
  </React.StrictMode>,
);
