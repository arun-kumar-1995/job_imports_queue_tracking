import cron from "node-cron";
import { redisClient } from "../../../configs/redis.configs.js";
import { RedisKeys } from "../../constants/redis.constants.js";
import { processJobQueues } from "../job_processing.services.js";

const MAX_POP_SIZE = 10;

(async () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Worker Service Started");
    try {
      const apiLists = await redisClient.HGETALL(RedisKeys.API_LISTS);

      for (const [apiUrl, apiId] of Object.entries(apiLists)) {
        const queueKey = `${RedisKeys.QUEUE_JOB_IDS}:${apiId}`;

        while (true) {
          // get job ids based on pop size ie 10
          const jobIds = await redisClient.lRange(
            queueKey,
            0,
            MAX_POP_SIZE - 1
          );
          if (!jobIds.length) break;

          // update queue for job ids
          await redisClient.lTrim(queueKey, jobIds.length, -1);

          console.log(`Processing ${jobIds.length} jobs for ${apiId}`);

          await processJobQueues(jobIds.map(Number), apiId);
        }
      }
    } catch (err) {
      console.log("Error processing cron worker", err);
    }
  });
})();
