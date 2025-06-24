import { HttpCodes } from "../constants/http_codes.constants.js";
import { APILists } from "../models/api_listing.models.js";
import { APIError } from "../utils/api_error.utils.js";
import { redisClient } from "../../configs/redis.configs.js";
import { APIResponse } from "../utils/api_response.utils.js";

export const addAPIUrl = async (req, res, next) => {
  try {
    const { api_url } = req.body;
    if (!api_url)
      return APIError(res, HttpCodes.BAD_REQUEST, "API Url is required");

    // define redis cashed for api url
    const cachedAPIUrl = `${process.env.REDIS_PREFIX}:api_lists`;

    // check for cachedAPIurl
    const apiUrl = await redisClient.SISMEMBER(cachedAPIUrl, api_url);
    if (apiUrl)
      return APIError(
        res,
        HttpCodes.CONFLICT,
        "This api url is already exists"
      );

    // create api and perform caching
    await APILists.create({ api_url });
    await redisClient.SADD(cachedAPIUrl, api_url);

    // return api response
    return APIResponse(res, HttpCodes.CREATED, "API Url inserted");
  } catch (err) {
    return next(err);
  }
};
