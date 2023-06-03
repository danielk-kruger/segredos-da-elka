const mongoose = require("mongoose");

const monthlyOrderSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    unique: true,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  clientCount: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
});

const MonthlyOrder = mongoose.model("MonthlyOrder", monthlyOrderSchema);

module.exports = MonthlyOrder;
