import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Import các Provider
import { CartProvider } from "./context/CartContext";
import { TransactionProvider } from "./context/TransactionContext";

const GOOGLE_CLIENT_ID =
  "339739206284-sse9cv3gs9u2d4vbohc60q0uf4mdg73j.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
