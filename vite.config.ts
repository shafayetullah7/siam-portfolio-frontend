import { defineConfig, loadEnv } from "vite";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = env.VITE_API_PROXY_PORT ?? "5000";
  const apiTarget = `http://localhost:${apiPort}`;

  return {
    plugins: [solidStart(), tailwindcss(), nitro()],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
