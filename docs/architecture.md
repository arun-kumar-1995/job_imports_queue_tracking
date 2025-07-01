## Job Import System

A scalable and efficient job import and queue processing system using Redis, Node.js, and MongoDB, designed with real-time processing and cron-based scheduling support.

---

## Tech Stack

- **Frontend:** React, JavaScript, CSS, `axios`, `react-hot-toast` (for notifications)
- **Backend:** Node.js, Express, MongoDB, CORS, Dotenv
- **Real-Time Communication:** Socket.IO
- **Caching & Queuing:** Redis (in-memory data store)

---

## System Architecture

The **Redis Queue System** follows a **Master-Slave (Producer-Worker)** architecture:

- The **Master Cron Job** runs every **2 minutes** to enqueue scheduled tasks based on predefined triggers.
- The **Worker (Slave)** runs every **1 minute**, processing jobs from the Redis queue.
- Multiple cron jobs can be registered dynamically using the `Add Cron Job` API endpoint, allowing for flexible and scalable job scheduling.

---

## How It Works

The system is designed to handle queue-based job imports with status tracking:

### Master Cron Scheduler

- Runs every **2 minutes**
- Fetches all active cron configurations from Redis
- Schedules eligible jobs and calls `processJobImports`

### `processJobImports` Function

- Loads API endpoints from Redis
- Iterates and enqueues job IDs if not already present
- Uses batch-based optimized loops to insert into `job_queues` with status `pending`

### `processJobQueues` Function

- Finds all the job queues based on ids
- Filter out missing job and create a logs for failed jobs
- Uses batch-based optimized loops to insert into `job_queues` with status `completed`
- Any failed records found while updating then its failed_jobs records are created with reason and logs are updated with new, updated and failed values.

### Worker Service

- Runs every **1 minute**
- Monitors Redis for any `pending` job IDs
- Executes jobs and updates status to `completed` or `failed`

---

## API Endpoints

### 1. **Add Cron Job**

- **Method:** `POST`
- **Endpoint:** `http://localhost:5000/app/v1/api-list/add-cron-job`
- **Description:** Registers a new cron job based on a schedule.

### 2. **Register API URL**

- **Method:** `POST`
- **Endpoint:** `http://localhost:5000/app/v1/api-list/add-api-url`
- **Description:** Adds a new API endpoint for job imports and change tracking.

### 3. **Fetch Logs**

- **Method:** `GET`
- **Endpoint:** `http://localhost:5000/app/v1/api-list/logs`
- **Description:** Retrieves job processing logs, including failed and updated records.  
  _Note: The `import_date` field is displayed in Indian Standard Time (IST) on the frontend._

---

## Database Schema & Relationships

A visual representation of the database schema and entity relationships:

🔗 **[View Schema on DrawSQL](https://drawsql.app/teams/aruns-organization/diagrams/job-imports)**

---
