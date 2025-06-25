export const RedisKeys = {
  API_LISTS: `${process.env.REDIS_PREFIX}:api_lists`,
  JOB_IDS: `${process.env.REDIS_PREFIX}:job_ids`,
  QUEUE_JOB_IDS: `${process.env.REDIS_PREFIX}:queue_job_ids`,
};
