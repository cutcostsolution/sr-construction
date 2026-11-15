#!/bin/bash
set -e

echo "=== Installing all dependencies ==="
npm install --include=dev

echo "=== Building client (Vite) ==="
npx vite build

echo "=== Building server (esbuild) ==="
node scripts/build-server.js

echo "=== Build complete ==="
