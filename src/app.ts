import "dotenv/config";

import express from "express";

import apiRouter from "./controllers/api";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// loadApiEndpoints(app);
app.use("/.well-known", apiRouter);

export default app;
