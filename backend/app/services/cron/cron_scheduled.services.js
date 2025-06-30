import cron from "node-cron";
import { redisClient } from "../../../configs/redis.configs.js";
import { RedisKeys } from "../../constants/redis.constants.js";
import { processJobImports } from "../job_processing.services.js";

(async () => {
  //  Master cron that runs every 2 minutes
  cron.schedule("*/2 * * * *", async () => {
    console.log("Executing Master cron");

    // get active cron from redis db
    const crons = await redisClient.HGETALL(RedisKeys.CRON_JOBS);

    for (const [cronJob, value] of Object.entries(crons)) {
      const { active, scheduled } = JSON.parse(value);
      if (active === 1) {
        cron.schedule(scheduled, async () => {
          console.log(`Cron job registered for ${cronJob}`);
          await processJobImports(cronJob);
        });
      }
    }
  });
})();
