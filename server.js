const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const dbConfig = require("./config/db.config");
var logger = require("./utils/logger");
const helmet = require("helmet");
const host = "localhost";

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
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

const options = {
  swaggerDefinition,

  // Paths to files containing OpenAPI definitions
  apis: [
    `${__dirname}/server.js`,
    "./controllers/user.controller.js",
    "./controllers/post.controller.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// secure the app by setting http headers
app.use(helmet());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
  logger.info("Server Sent A Hello World!");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
require("./routes/user.routes")(app);
require("./routes/post.routes")(app);
require("./routes/comment.routes")(app);

// Capture 404 erors
app.use((req, res, next) => {
  res.status(404).send("PAGE NOT FOUND");
  logger.error(
    `400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
});

// Capture 500 errors
app.use((err, req, res, next) => {
  res.status(500).send("Could not perform the calculation!");
  logger.error(
    `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  logger.info(`Server started and running on http://${host}:${PORT}`);
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
