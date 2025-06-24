import express from "express";
import compression from "compression";
import cors from "cors";
import appRoutes from "./routes/index.js";

/**
 * Configure app
 **/

const app = express();

/**
 * Middlewares
 */

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

app.use("app/v1", appRoutes);


export default app;