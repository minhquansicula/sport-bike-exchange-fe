import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router"; // Import file cấu hình router của bạn

const App = () => {
  // RouterProvider sẽ giúp render trang tương ứng với đường dẫn URL
  return <RouterProvider router={router} />;
};

export default App;
