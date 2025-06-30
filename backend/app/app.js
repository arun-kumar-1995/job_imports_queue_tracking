import "./services/cron/cron_worker.services.js";
import "./services/cron/cron_scheduled.services.js"
import express from "express";
import compression from "compression";
import cors from "cors";
import appRoutes from "./routes/index.js";
import { ErrorMiddleware } from "./middlewares/error.middlewares.js";

// configure app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(cors());

/**
 * Routing
 */
app.get("/health", (req, res) => {
  return res.status(200).json({
    succee: true,
    message: "Ok",
  });
});

app.use("/app/v1", appRoutes);

app.use(ErrorMiddleware);

export default app;
