import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// @desc    Create a new order
// @route   POST /orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { items, totalAmount, paymentMethod, shippingDetails } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error("No order items provided");
    }

    if (!totalAmount || !paymentMethod || !shippingDetails) {
        res.status(400);
        throw new Error("Missing required order information");
    }

    const userId = req.user.id || req.user._id;

    const order = await Order.create({
        user: userId,
        items,
        totalAmount: Number(totalAmount),
        paymentMethod,
        shippingDetails,
        paymentStatus: paymentMethod === "payhere" ? "Paid" : "Pending",
        orderStatus: "Pending",
    });

    return res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        data: order,
    });
});

// @desc    Get logged in user's orders
// @route   GET /orders (or /orders/my-orders)
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        orders,
    });
});

// @desc    Get all orders (Admin only)
// @route   GET /orders/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        orders,
    });
});

// @desc    Update order status
// @route   PATCH /orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    order.orderStatus = status;

    // Business logic: If order is delivered and payment method was Cash on Delivery, mark it paid.
    if (status === "Delivered" && order.paymentMethod === "cod") {
        order.paymentStatus = "Paid";
    }

    const updatedOrder = await order.save();

    return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: updatedOrder,
    });
});
