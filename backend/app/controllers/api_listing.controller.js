import { HttpCodes } from "../constants/http_codes.constants.js";
import { APILists } from "../models/api_listing.models.js";
import { APIError } from "../utils/api_error.utils.js";
import { redisClient } from "../../configs/redis.configs.js";
import { APIResponse } from "../utils/api_response.utils.js";
import { RedisKeys } from "../constants/redis.constants.js";
import { CronJobs } from "../models/cron_jobs.models.js";
import { ImportLogs } from "../models/import_logs.models.js";

export const addAPIUrl = async (req, res, next) => {
  try {
    const { api_url } = req.body;
    if (!api_url)
      return APIError(res, HttpCodes.BAD_REQUEST, "API Url is required");

    // check for cachedAPIurl
    const apiUrl = await redisClient.HGET(RedisKeys.API_LISTS, api_url);
    if (apiUrl)
      return APIError(
        res,
        HttpCodes.CONFLICT,
        "This api url is already exists"
      );

    // create api and perform caching
    const apiDoc = await APILists.create({ api_url });
    await redisClient.HSET(RedisKeys.API_LISTS, api_url, apiDoc._id.toString());

    // return api response
    return APIResponse(res, HttpCodes.CREATED, "API Url inserted");
  } catch (err) {
    return next(err);
  }
};

export const addCronJob = async (req, res, next) => {
  try {
    const { cron_name, active, scheduled_at } = req.body;

    // check if this cron name exis inside db
    const cronJob = await redisClient.HGET(RedisKeys.CRON_JOBS, cron_name);
    if (cronJob)
      return APIError(
        res,
        HttpCodes.CONFLICT,
        "This cron is already registered"
      );

    await CronJobs.create(req.body);
    await redisClient.HSET(
      RedisKeys.CRON_JOBS,
      cron_name,
      JSON.stringify({
        active: 1,
        scheduled: scheduled_at,
      })
    );

    return APIResponse(res, HttpCodes.OK, "Cron registered");
  } catch (err) {
    return next(err);
  }
};

export const importLogs = async (req, res, next) => {
  try {
    const importLogs = await ImportLogs.find({}).sort({ _id: -1 });
    return APIResponse(res, HttpCodes.OK, "Here are the logs", { importLogs });
  } catch (err) {
    next(err);
  }
};
