import { Router } from "express";
import { addAPIUrl } from "../controllers/api_listing.controller.js";
const router = Router();

router.route("/add-api-url").post(addAPIUrl);

export default router;
