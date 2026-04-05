# 🚀 Frontend Auto Deployer (Vercel Clone)

A full-stack deployment system that allows users to deploy frontend projects (like React apps) using a Git repository — similar to Vercel.

---

## 🌟 Features

* 🔹 Deploy frontend apps using a GitHub repository URL
* 🔹 Automatic build using Docker containers (AWS ECS Fargate)
* 🔹 Static assets hosted on AWS S3
* 🔹 Reverse proxy for dynamic routing via subdomains
* 🔹 Real-time build logs using Redis + Socket.IO
* 🔹 Fully scalable cloud-native architecture

---

## 🏗️ Architecture Overview

```
User → API Server → AWS ECS (Builder Container)
                       ↓
                 Build Project
                       ↓
                 Upload to S3
                       ↓
            Reverse Proxy serves site
                       ↓
         Redis + Socket.IO for logs
```

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js
* Socket.IO
* ioredis

### Cloud & DevOps

* AWS ECS (Fargate)
* AWS S3
* Docker
* AWS SDK

### Other

* Redis (Upstash)
* Reverse Proxy (http-proxy)

---

## 📂 Project Structure

```
/api-server        → Handles deployment requests & ECS tasks
/build-server      → Docker container that builds and uploads project
/s3-reverse-proxy → Serves deployed projects via subdomain routing
```

---

## 🔑 Environment Variables

Create a `.env` file in `api-server`:

```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
REDIS_URL=your_upstash_redis_url
```

---

## 🚀 How It Works

1. User sends a POST request with GitHub repo URL
2. API server triggers an ECS task
3. Builder container:

   * Clones repo
   * Runs build (`npm install && npm run build`)
   * Uploads files to S3
4. Reverse proxy serves the project using a subdomain
5. Logs are streamed via Redis → Socket.IO

---

## 🧪 Running Locally

### 1️⃣ API Server

```
cd api-server
npm install
node index.js
```

---

### 2️⃣ Reverse Proxy

```
cd s3-reverse-proxy
npm install
node index.js
```

---

### 3️⃣ Build Server (Docker)

```
cd build-server
docker build -t builder-image .
docker run builder-image
```

---

## 📡 API Endpoint

### Create Project

```
POST /project
```

#### Body

```json
{
  "gitURL": "https://github.com/your-repo"
}
```

#### Response

```json
{
  "status": "queued",
  "data": {
    "projectSlug": "random-slug",
    "url": "http://localhost:8000/<slug>"
  }
}
```

---

## 📊 Future Improvements

* 🌐 Custom domains support
* 📊 Deployment dashboard UI
* 🔐 Authentication system
* ⚡ CI/CD optimizations
* 📦 Multi-framework support

---

## 🧠 Learnings

* Container orchestration with AWS ECS
* Real-time communication with WebSockets
* Scalable deployment architecture
* Reverse proxy routing
* Cloud storage and asset serving

---

## 🙌 Author

**Avni Gupta**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub and share!
