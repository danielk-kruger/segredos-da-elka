const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  subject: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
