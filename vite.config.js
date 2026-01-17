import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: "#FC5200", // Cam Strava
        secondary: "#242428", // Đen Xám
        background: "#F7F7F7", // Xám nền
        surface: "#FFFFFF", // Trắng
        success: "#22C55E", // Xanh lá
        danger: "#EF4444", // Đỏ
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
