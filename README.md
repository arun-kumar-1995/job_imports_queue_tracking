## Scalable File import and queue tracking

Hello visitors, This project involves building a scalable job importer that fetches job data from external XML APIs, processes it using Redis queues, and stores it in MongoDB. It also includes an admin panel React.js to track import history, including new, updated, and failed records.

## Project Overview.

```
├── client                 # contains react app
└── backend                # contains server/backend
└── README.md              # Project setup explanation
└── docs/architecture.md   # Project documentation
```

## Tech Stack

- **Frontend**: React, JavaScript, CSS, axios`react-hot-toast` for notifications.
- **Backend** : Node, express , mongodb , cors , dotenv
- **Real time communication** : Socket
- **Caching** : Redis in-memory data

## Installation

```bash
  https://github.com/arun-kumar-1995/job_imports_queue_tracking
```

## Install dependencies

```bash
cd client
npm install
npm run dev : To start the client application
cd backend
npm install
npm run dev : To start the backend server
```

## 📘 API Endpoints Documentation

### 1. Add Cron Job

- **Method:** `POST`
- **Endpoint:** `http://localhost:5000/app/v1/api-list/add-cron-job`
- **Description:**  
  Registers a new cron job based on the provided schedule. This job will trigger at the specified intervals for automated task execution.

---

### 2. Register API URL

- **Method:** `POST`
- **Endpoint:** `http://localhost:5000/app/v1/api-list/add-api-url`
- **Description:**  
  Adds a new API endpoint to be used for job imports. Useful for dynamic registration of data ingestion sources.

---

### 3. Fetch Logs

- **Method:** `GET`
- **Endpoint:** `http://localhost:5000/app/v1/api-list/logs`
- **Description:**  
  Retrieves a list of logs related to scheduled jobs and API executions for monitoring and debugging purposes.

## SAMPLE CONFIG FILE

- create .env file inside root folder of backend that holds all the server configuration

```bash
# ====== APPLICATION =============
NODE_ENV=development
PORT=5000
APP_HOST=http://localhost

# ======== DATABASE ========
MONGO_URL=mongodb+srv://<username>:<passowrd>@cluster0.e3kp6.mongodb.net/?retryWrites=true&w=majority
DB_NAME=job_portal

# ======= REDIS CONFIGURATION ===========
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_PREFIX=job_portal
REDIS_TTL_DEFAULT=3600
REDIS_PIPELINE_CHUNK_SIZE=100

```
