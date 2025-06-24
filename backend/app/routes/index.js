/**
 * Global Imports
 **/

import { Router } from "express";
import apiListing from "./api_listing.routes.js";

const router = Router();
router.use("/api-list", apiListing);

export default router;
