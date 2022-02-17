import express ,{Request,Response,Application} from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from './src/config/dbConnect';
// import logger from './src/utils/logger';

import helmet from "helmet";
const host = "localhost";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {userRoutes} from "./src/routes/user.routes";
import {postRoutes} from "./src/routes/post.routes";
import {commentRoutes} from "./src/routes/comment.routes";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API",
    version: "1.0.0",
    description: "This is a REST API application made with Express.",
  },
  servers: [
    {
      url: "http://localhost:8080/",
      description: "Development server",
    },
  ],
  basePath: {
    default: "/api/v1",
  },
};

const options:any = {
  swaggerDefinition,

  // Paths to files containing OpenAPI definitions
  apis: [
    `${__dirname}/server.js`,
    "./controllers/user.controller.js",
    "./controllers/post.controller.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const app:Application = express();

var corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// secure the app by setting http headers
app.use(helmet());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

// routes
app.get("/", (req:Request, res:Response) => {
  res.json({ message: "Welcome to the application." });
  // logger.info("Server Sent A Hello World!");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment', commentRoutes);
// require("./routes/user.routes")(app);


// Capture 404 erors
app.use((req, res, next) => {
  res.status(404).send("PAGE NOT FOUND");
  // logger.error(
  //   `400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  // );
});

// Capture 500 errors
app.use((err, req, res, next) => {
  res.status(500).send("Could not perform the calculation!");
  // logger.error(
  //   `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
  //     req.originalUrl
  //   } - ${req.method} - ${req.ip}`
  // );
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  // logger.info(`Server started and running on http://${host}:${PORT}`);
});



