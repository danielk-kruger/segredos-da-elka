const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const {
  getProducts,
  orderProducts,
  getSelectedProduct,
} = require("./controllers/ShopController");
const {
  getPendingOrders,
  getFulfilledOrders,
  getOrdersByDate,
  getOrdersInAscendingPrice,
  getOrdersInDescendingPrice,
} = require("./controllers/dashboard.controller");

const app = express();

const port = process.env.PORT || 3250;

mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database...");
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", "./public");
app.use(cors());

// routes
app.route("/:category").get(getProducts);
app.route("/api/select/:productId").get(getSelectedProduct);
app.route("/products/cart/order").post(orderProducts);

// Dashboard Routes

app.route("/orders/pending").get(getPendingOrders);
app.route("/orders/fulfilled").get(getFulfilledOrders);
app.route("/orders/byDate").get(getOrdersByDate);
app.route("/orders/expensive").get(getOrdersInAscendingPrice);
app.route("/orders/cheapest").get(getOrdersInDescendingPrice);
