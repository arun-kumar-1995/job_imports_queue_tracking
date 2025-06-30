import { Router } from "express";
import { addAPIUrl, addCronJob } from "../controllers/api_listing.controller.js";
const router = Router();

router.route("/add-api-url").post(addAPIUrl);
router.route("/add-cron-job").post(addCronJob);

export default router;
