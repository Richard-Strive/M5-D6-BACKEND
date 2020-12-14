const express = require("express");
const cors = require("cors");
const { join } = require("path");
const listEndpoints = require("express-list-endpoints");
const productsRouter = require("./products");
const reviewsRouter = require("./reviews");
const problematicRoutes = require("./problematicRoutes");
const publicFolderPath = join(__dirname, "../public");
const {
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
} = require("./errorHandling");
const server = express();
server.use(cors());
server.use(express.static(publicFolderPath));
const port = 3001;
server.use(express.json());

server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);

server.use(notFoundErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(badRequestErrorHandler);
server.use(catchAllErrorHandler);

server.listen(port, () => {
  console.log("teamwork TODAY");
});

console.log(listEndpoints(server));
