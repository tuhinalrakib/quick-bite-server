import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the food name"],
      trim: true,
      maxlength: [100, "Food name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description for the food"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the food price"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Please provide a food image URL or path"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category for the food"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["pizza", "burgers", "cake", "salads", "beverages", "trending"],
        message: "{VALUE} is not a valid food category",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.0, 
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    restaurantName: {
      type: String,
      default: "Restaurant Origin",
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

foodSchema.index({ name: "text", category: "text" });

const Food = mongoose.model("Food", foodSchema);
export default Food;