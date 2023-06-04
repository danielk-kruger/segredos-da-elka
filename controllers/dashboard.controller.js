const Order = require("../model/Order");
const Record = require("../model/Record");
const {
  SucessResponseWithData,
  ErrorResponse,
  ValidationErrorWithData,
} = require("../helpers/apiResponse");

exports.getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ deliveryStatus: false });

    return SucessResponseWithData(
      res,
      "Fetched Pending Orders Sucessfully",
      pendingOrders
    );
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, "Unable to fetch Orders");
  }
};

exports.getFulfilledOrders = async (req, res) => {
  try {
    const fulfilledOrders = await Order.find({ deliveryStatus: true });

    return SucessResponseWithData(
      res,
      "Fetched fulfilled orders sucessfully",
      fulfilledOrders
    );
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, "Unable to fetch fulfilled orders");
  }
};

exports.getOrdersByDate = async (req, res) => {
  const pickupDate = new Date(req.body.pickupDate);

  if (isNaN(pickupDate))
    return ValidationErrorWithData(res, "Invalid Date", { pickupDate });

  const startDate = new Date(
    pickupDate.getFullYear(),
    pickupDate.getMonth(),
    pickupDate.getDate()
  );
  const endDate = new Date(
    pickupDate.getFullYear(),
    pickupDate.getMonth(),
    pickupDate.getDate() + 1
  );

  console.log("Start Date: " + startDate);
  console.log("End Date" + endDate);

  try {
    const orders = await Order.find({
      pickupDate: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    return SucessResponseWithData(
      res,
      `Found orders for ${pickupDate.getDate()}`,
      orders
    );
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, "Unable to fetch Orders by Date");
  }
};

exports.getOrdersInAscendingPrice = async (req, res) => {
  try {
    const ordersAscending = await Order.find().sort({ totalPrice: 1 });

    return SucessResponseWithData(
      res,
      "Fetched Orders in ascending order",
      ordersAscending
    );
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, "Unable to get orders");
  }
};

exports.getOrdersInDescendingPrice = async (req, res) => {
  try {
    const ordersAscending = await Order.find().sort({ totalPrice: -1 });

    return SucessResponseWithData(
      res,
      "Fetched Orders in ascending order",
      ordersAscending
    );
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, "Unable to get orders");
  }
};
