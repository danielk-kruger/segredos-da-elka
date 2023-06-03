const {
  SucessResponseWithData,
  ErrorResponse,
} = require("../helpers/apiResponse");

const { storeContent } = require("../api/content");
const mailer = require("../helpers/mailer");
const Order = require("../model/Order");

// const client = content.InitCMS();
/*

* Get Products
* Order a product
* email product
* parse email to shop
* send parsed email to whatsapp

*/

// send email with products
exports.orderProducts = async (req, res) => {
  try {
    const { fullName, pickupDate, phoneNumber, cartItems, totalPrice } =
      req.body;

    const order = new Order({
      fullName,
      phoneNumber,
      pickupDate,
      cartItems,
      totalPrice,
    });
    await order.save().then(() => {
      mailer.send(
        "kruger.dkk@gmail.com",
        "danniellkkruger@gmail.com",
        "test email",
        `<h1>Hello ${fullName}</h1>`
      );
    });
    console.log(order);

    return SucessResponseWithData(
      res,
      "Order made successfully",
      JSON.stringify(order, null, 2)
    );
  } catch (error) {
    console.error(error);
    return ErrorResponse(res, "Unable to order products");
  }
};

/*
 * ROUTE:
 * localhost:3020/api/products/:category?
 */
exports.getProducts = async (req, res) => {
  const products = await storeContent();

  try {
    if (req.params.category) {
      const filteredProducts =
        req.params.category.toLowerCase() === "all"
          ? products
          : products.filter(
              (prod) =>
                prod.category.toLowerCase() ===
                req.params.category.toLowerCase()
            );

      // filteredProducts.forEach((item) => console.log(item));
      res.render("index", { filteredProducts });
    }
  } catch (err) {
    console.log(err);
    return ErrorResponse(res, "Unable to fetch products");
  }
};

exports.getSelectedProduct = async (req, res) => {
  const products = await storeContent();
  try {
    const { productId } = req.params;
    const product = products.filter((item) => item.id === productId);
    console.log(product);

    return SucessResponseWithData(res, "Found product", product);
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, "Unable to find product");
  }
};
