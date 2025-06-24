/**
 * Global imports
 **/

import dotenv from "dotenv";
dotenv.config();

(() => {
  const EnvVariables = ["NODE_ENV", "PORT", "APP_HOST", "MONGO_URL", "DB_NAME"];

  const missingEnv = EnvVariables.filter((key) => !process.env[key]);
  // check for required env variables
  if (missingEnv.length > 0) {
    console.log("Missing Environment Variables: " + missingEnv.join(","));
    process.exit(0);
  }
})();
