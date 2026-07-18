# 🚀 Maki Fashion & Hair Style Planner (ማኪ) - Render Deployment Guide

This is a full-stack Web Application built using React (Vite) for the frontend and Express (Node.js) for the backend. It integrates **Gemini Pro Vision** for receipt scanning and custom styling analysis, and **MongoDB Atlas** for secure, persistent user records with automatic expiration (TTL indexing).

Follow the steps below to successfully deploy this application to **Render**.

---

## 🛠️ Step 1: Create a Web Service on Render

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (or Git provider) where this code is hosted.

---

## ⚙️ Step 2: Configure Build & Start Commands

In the Render Web Service configuration, set the following options:

*   **Runtime:** `Node`
*   **Build Command:** 
    ```bash
    npm run build
    ```
    *(This runs `vite build` for the static assets and bundles `server.ts` into a self-contained `dist/server.cjs` file using `esbuild`).*
*   **Start Command:** 
    ```bash
    npm run start
    ```
    *(This runs the compiled Express backend from `dist/server.cjs`).*

---

## ⚡ Troubleshooting: "vite: not found" Build Error

If you encountered a `vite: not found` error during deployment on Render, it is caused by Render attempting to use other lock files (such as Bun) which ignores standard NPM dependency configurations and results in failed package installations.

We have fully resolved this for you by:
1. **Removing `bun.lock`**: The old `bun.lock` file has been deleted from the repository. This forces Render to use the standard `npm install` package installer.
2. **Moving all build dependencies**: Packages like `vite`, `esbuild`, `tailwindcss`, and `typescript` have been moved directly into **`dependencies`** instead of `devDependencies`. This ensures Render installs them even under a `NODE_ENV=production` environment.
3. **Generating `package-lock.json`**: An official fresh `package-lock.json` is generated to lock down package versions securely.

### How to trigger a clean build on Render:
1. Go to your web service page in the **Render Dashboard**.
2. Click the **Manual Deploy** button in the top-right corner.
3. Select **Clear Build Cache & Deploy**.
4. Render will now perform a clean `npm install` with your package lock file, compile successfully, and launch without any issues!

---

## 🔑 Step 3: Configure Environment Variables

Under the **Environment** tab in your Render Web Service, add the following key-value pairs:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Instructs the application to run in production mode (serves static assets from `/dist`). |
| `GEMINI_API_KEY` | `YOUR_GEMINI_API_KEY` | Your Google Gemini API Key. |
| `MONGODB_URI` | `YOUR_MONGODB_CONNECTION_STRING` | Your MongoDB Atlas connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname`). |

> ⚠️ **Note:** Do not share or commit these keys into Git! Always define them securely inside the Render dashboard.

---

## 💾 Step 4: MongoDB Atlas Database Setup (Recommended)

To allow the user data, purchases, and style recommendations to persist and expire correctly:
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free-tier cluster and get your connection URI.
3. Make sure to configure the IP Access List in Atlas to **Allow access from anywhere (`0.0.0.0/0`)**, because Render's outbound IPs are dynamic.
4. Once connected, the application will automatically initialize the collections, create unique constraints on transaction IDs, and register a **TTL (Time-To-Live) index** so that packages delete themselves automatically when they expire (e.g., after 1 day, 7 days, or 30 days depending on the purchased package).

---

## 🔍 How the Build and Start Flow Works Under the Hood

1. **`npm run build`**: 
    - Bundles the frontend SPA static files into `/dist` via Vite.
    - Bundles `server.ts` and its relative dependencies into `/dist/server.cjs` via `esbuild`. This eliminates any relative module importing errors at runtime.
2. **`npm run start`**:
    - Launches the unified server using `node dist/server.cjs` which listens on port `3000` (automatically mapped by Render's proxy) and serves both the Express APIs and the frontend SPA assets concurrently.
