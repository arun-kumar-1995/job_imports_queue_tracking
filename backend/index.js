/**
 * Global imports
 **/
import "./configs/loadEnv.configs.js";
import app from "./app/app.js";
import { connectDB } from "./configs/db.configs.js";
import { connectRedis } from "./configs/redis.configs.js";
const port = process.env.PORT || 8000;

/**
 * Global process-level error handlers
 **/
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

/**
 * Initialize the application
 */
(async () => {
  try {
    // connect the databse
    await connectDB();

    // connect redis
    await connectRedis();
    
    // start the express server
    app.listen(port, () => {
      console.log(`Server started : ${process.env.APP_HOST}:${port}`);
    });
  } catch (err) {
    console.log("Error Starting Server");
    process.exit(1);
  }
})();
