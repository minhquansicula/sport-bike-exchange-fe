// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
// AuthProvider đã được wrap trong RootLayout của router.jsx

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
