import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactivexPlugins from "reactivex/babel-plugins";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: reactivexPlugins(),
      },
    }),
  ],
});
