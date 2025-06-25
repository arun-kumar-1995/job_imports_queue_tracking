import { redisClient } from "../../configs/redis.configs.js";
import { RedisKeys } from "../constants/redis.constants.js";
import { ImportLogs } from "../models/import_logs.models.js";
import { JobQueues } from "../models/job_queues.models.js";
import { fetchJobs } from "../utils/job_parser.utils.js";
const REDIS_PIPELINE_CHUNK_SIZE = 500;

export const processJobImports = async () => {
  try {
    console.log("Running Scheduled Jobs for job imports");
    // get list of apis from redis cache
    const apiLists = await redisClient.HGETALL(RedisKeys.API_LISTS);

    // get jobs data for each api url
    for (const [apiUrl, apiId] of Object.entries(apiLists)) {
      console.log(`Started job Imports for JOB Url: ${apiUrl}`);
      const jobsData = await fetchJobs(apiUrl);

      /**
       * for each api url perform batch operation
       * check for job_id inside redis for fast lookup
       * if job_id is not present then create a queue record and update inside redis count and create a job record
       * */

      const jobIds = jobsData.map((job) => job.id.toString());

      const existsFlags = [];
      for (let i = 0; i < jobIds.length; i += REDIS_PIPELINE_CHUNK_SIZE) {
        const chunk = jobIds.slice(i, i + REDIS_PIPELINE_CHUNK_SIZE);
        const chunkFlags = await redisClient.SMISMEMBER(
          `${RedisKeys.JOB_IDS}:${apiId}`,
          chunk
        );
        existsFlags.push(...chunkFlags);
      }

      // Collect IDs that are not in Redis
      const uniqueJobIds = jobIds.filter(
        (id, index) => existsFlags[index] === 0
      );

      // create imports
      await ImportLogs.create({
        import_date: Date.now(),
        file_name: apiUrl,
        api_id: apiId,
        total: jobsData.length,
        new: uniqueJobIds.length,
      });

      if (uniqueJobIds.length === 0) {
        console.log(`No new jobs found for API: ${apiUrl}`);
        continue;
      }

      // perform batch operation
      for (let i = 0; i < uniqueJobIds.length; i += REDIS_PIPELINE_CHUNK_SIZE) {
        const chunk = uniqueJobIds.slice(i, i + REDIS_PIPELINE_CHUNK_SIZE);

        // create job queueDocs for all the unique jobs id
        await JobQueues.insertMany(
          chunk.map((jobId) => ({
            api_id: apiId,
            job_id: Number(jobId),
            status: "pending",
          })),
          { ordered: false }
        );

        const pipeline = redisClient.multi();

        chunk.forEach((jobId) => {
          pipeline.SADD(`${RedisKeys.QUEUE_JOB_IDS}:${apiId}`, jobId);
          pipeline.SADD(`${RedisKeys.JOB_IDS}:${apiId}`, jobId);
        });

        await pipeline.exec();
      }
    }
  } catch (err) {
    console.log("Error processing job imports : ", err);
    process.exit(1);
  }
};
