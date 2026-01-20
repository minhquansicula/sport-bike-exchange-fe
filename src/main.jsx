import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Import các Provider
import { AuthProvider } from "./hooks/useAuth.jsx";
// import { WishlistProvider } from "./context/WishListContext.jsx";
import { CartProvider } from "./context/CartContext";
import { TransactionProvider } from "./context/TransactionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </React.StrictMode>,
);
