import { HttpCodes } from "../constants/http_codes.constants.js";
import { APILists } from "../models/api_listing.models.js";
import { APIError } from "../utils/api_error.utils.js";

export const addAPIUrl = async (req, res, next) => {
  try {
    const { api_url } = req.body;
    const apiUrl = APILists.findOne({ api_url });
    if (apiUrl)
      throw new APIError(HttpCodes.CONFLICT, "This api url is already exists");
    await APILists.create({ api_url });
    return APIResponse(res, HttpCodes.CREATED, "API Url inserted");
  } catch (err) {
    next(err);
  }
};
