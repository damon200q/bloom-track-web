import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // ... alias 不变
  },
  root: "./client", // 保持这行不变，说明你的源码在 client 文件夹
  build: {
    outDir: "../dist", // 【关键修改】这里改成 "../dist"
    emptyOutDir: true,
  },
});