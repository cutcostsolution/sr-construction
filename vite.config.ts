import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Conditionally load dev-only plugins so production build doesn't crash
// if devDependencies aren't available (e.g. on Render)
let devServerPlugin: any = null
let inspectPlugin: any = null
try {
  const { default: devServer } = await import("@hono/vite-dev-server")
  devServerPlugin = devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] })
} catch { /* dev-only, ignore in production */ }
try {
  const { inspectAttr } = await import("kimi-plugin-inspect-react")
  inspectPlugin = inspectAttr()
} catch { /* dev-only, ignore in production */ }

const plugins: any[] = [
  {
    name: "kimi-preview-host",
    config(config: any) {
      const hosts = config.server?.allowedHosts;
      if (hosts === true || hosts?.includes("3000.proxy.internal")) return;
      return { server: { allowedHosts: ["3000.proxy.internal"] } };
    },
  },
]
if (devServerPlugin) plugins.push(devServerPlugin)
if (inspectPlugin) plugins.push(inspectPlugin)
plugins.push(react())

// https://vite.dev/config/
export default defineConfig({
  plugins,
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
})
