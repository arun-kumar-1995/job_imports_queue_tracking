import { redisClient } from "../../configs/redis.configs.js";
import { CronStatus } from "../constants/cron_status.constants.js";
import { RedisKeys } from "../constants/redis.constants.js";
import { FailedJobs } from "../models/failed_Jobs.models.js";
import { ImportLogs } from "../models/import_logs.models.js";
import { JobQueues } from "../models/job_queues.models.js";
import { fetchJobs } from "../utils/job_parser.utils.js";
const REDIS_PIPELINE_CHUNK_SIZE = 500;

export const processJobImports = async (cronType) => {
  try {
    console.log(`Cron Job started for Cron Type: ${cronType}`);
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

      const jobIds =
        jobsData.length > 0 && jobsData.map((job) => job.id.toString());

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
          pipeline.LPUSH(`${RedisKeys.QUEUE_JOB_IDS}:${apiId}`, jobId);
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

export const processJobQueues = async (jobIds, apiId) => {
  try {
    // find all job queues docs
    const jobs = await JobQueues.find({
      job_id: { $in: jobIds },
      api_id: apiId,
    })
      .select("_id job_id")
      .lean();

    // find missing job ids
    const missingJobIds = jobIds.filter(id => !new Set(jobs.map(job => job.job_id)).has(id));

    // create failed jobs with reason no jobs found
    if (missingJobIds.length > 0) {
      await FailedJobs.updateMany(
        missingJobIds.map((id) => ({
          api_id: apiId,
          job_id: Number(id),
          reason: "Job not found in JobQueues",
        }))
      );
    }

    // update job queues with status completed
    const queuePromiseResult = await Promise.allSettled(
      jobs.map((job) =>
        JobQueues.updateOne(
          { job_id: job.job_id, api_id: apiId },
          { $set: { status: CronStatus.COMPLETED } }
        )
      )
    );

    // find failed jobids
    const failedJobIds = queuePromiseResult
      .map((res, idx) => {
        if (res.value.modifiedCount === 0 && res.value.matchedCount === 0)
          return jobs[idx];
      })
      .filter(Boolean);

    // create failed job records
    let failedDocIds = [];
    if (failedJobIds.length > 0) {
      const failedDoc = await FailedJobs.updateMany(
        missingJobIds.map((id) => ({
          api_id: apiId,
          job_id: Number(id),
          reason: "Unable to process jobQueues",
        }))
      );

      failedDocIds = failedDoc.map((doc) => doc._id);
      // push inside failed queues
      await redisClient.SADD(
        `${RedisKeys.FAILED_JOB_IDS}:${apiId}`,
        ...failedJobIds
      );
    }

    // update import logs sorted by id
    await ImportLogs.findOneAndUpdate(
      { api_id: apiId },
      {
        $inc: { updated: jobs.length - failedDocIds.length },
        $push: { failed_jobs: { $each: failedDocIds } },
      },
      { sort: { _id: 1 }, new: true }
    );
  } catch (err) {
    console.log("Error inside processing Job Queues", err);
    process.exit(1);
  }
};
