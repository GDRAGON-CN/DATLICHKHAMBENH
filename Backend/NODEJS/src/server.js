import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoute from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
import cronService from "./services/cronService";

require("dotenv").config();

let app = express();
app.use(cors({ origin: true }));

cronService.initCronJobs();
app.set("trust proxy", 1);
// config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initWebRoute(app);

connectDB();

// de chay dc
let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("backend nodejs is running on the port: " + port);
});

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
