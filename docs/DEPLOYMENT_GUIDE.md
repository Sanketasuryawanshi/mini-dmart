# 🚀 Free Cloud Deployment Guide — Mini D-Mart

This step-by-step guide walks you through deploying the Mini D-Mart Full-Stack Application for **100% free** using standard developer cloud platforms.

---

## 🏗️ Deployment Architecture

```
[ Frontend: Vercel / Netlify (Free) ]
                   │
                   ▼ (HTTPS API Calls with JWT)
[ Backend: Render / Railway / Koyeb (Free Web Service) ]
                   │
                   ▼ (JDBC SSL Connection)
[ Database: Aiven / TiDB Cloud / Clever Cloud (Free MySQL) ]
```

---

## Step 1: Free Cloud MySQL Database (5 minutes)

You can get a free managed MySQL database from **Aiven** or **TiDB Cloud**:

### Option A: Aiven for MySQL (Recommended - Free Tier)
1. Go to [https://aiven.io](https://aiven.io) and create a free account.
2. Click **Create Service** ➔ Select **MySQL** ➔ Choose the **Free Plan**.
3. Once provisioned, copy the **Service URI** or connection credentials:
   - **Host / Port**: `mysql-xxx.aivencloud.com:12345`
   - **User**: `avnadmin`
   - **Password**: `YourPassword`
   - **Database**: `defaultdb` (or create `minidmart_db`)
4. Construct your JDBC URL:
   ```properties
   spring.datasource.url=jdbc:mysql://<HOST>:<PORT>/defaultdb?sslmode=require&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
   spring.datasource.username=avnadmin
   spring.datasource.password=<PASSWORD>
   ```

---

## Step 2: Deploy Backend to Render (Free Web Service)

1. Push your repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/mini-dmart.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [https://render.com](https://render.com) and log in with GitHub.
3. Click **New +** ➔ **Web Service**.
4. Connect your `mini-dmart` repository.
5. Configure the service:
   - **Name**: `mini-dmart-backend`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** *(Render will automatically use the multi-stage `backend/Dockerfile`)*
   - **Instance Type**: **Free**
6. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `SERVER_PORT` | `8088` |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<AIVEN_HOST>:<PORT>/defaultdb?sslmode=require&allowPublicKeyRetrieval=true` |
   | `SPRING_DATASOURCE_USERNAME` | `<AIVEN_USERNAME>` |
   | `SPRING_DATASOURCE_PASSWORD` | `<AIVEN_PASSWORD>` |
   | `APP_JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970337336763979244226452948404D6351` |
   | `APP_JWT_EXPIRATION_MS` | `86400000` |
7. Click **Create Web Service**.  
   Render will build the Docker container and give you a public URL (e.g. `https://mini-dmart-backend.onrender.com`).

---

## Step 3: Deploy Frontend to Vercel or Netlify (Free)

### Option A: Vercel (Recommended - 2 minutes)
1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** ➔ **Project**.
3. Import your `mini-dmart` repository.
4. Configure settings:
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Framework Preset**: `Vite` (auto-detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - **`VITE_API_BASE_URL`**: `https://mini-dmart-backend.onrender.com/api` *(Your deployed Render backend URL)*
6. Click **Deploy**.  
   Vercel will build and give you a public URL (e.g. `https://mini-dmart.vercel.app`).

### Option B: Netlify
1. Go to [https://netlify.com](https://netlify.com) ➔ **Add new site** ➔ **Import an existing project**.
2. Connect your GitHub repo and select base directory as `frontend`.
3. Build command: `npm run build`, publish directory: `frontend/dist`.
4. Set Environment Variable: `VITE_API_BASE_URL` = `https://mini-dmart-backend.onrender.com/api`.
5. Click **Deploy Site**.

---

## ✅ Post-Deployment Verification Checklist

1. Open your live Vercel/Netlify URL (`https://your-app.vercel.app`).
2. Verify products and categories load on the homepage.
3. Sign in using test credentials (`admin@dmart.com` / `admin123`).
4. Test placing a grocery order (Store Pickup or Home Delivery).
5. Open the Admin / Staff dashboards to verify live metrics!
