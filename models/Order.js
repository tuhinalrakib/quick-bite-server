import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["cod", "payhere"],
        message: "{VALUE} is not a supported payment method",
      },
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["Pending", "Paid", "Failed"],
        message: "{VALUE} is not a valid payment status",
      },
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Pending", "Processing", "Delivered", "Cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "Pending",
    },
    shippingDetails: {
      name: {
        type: String,
        required: [true, "Recipient name is required"],
      },
      phone: {
        type: String,
        required: [true, "Contact number is required"],
      },
      address: {
        type: String,
        required: [true, "Delivery address is required"],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
