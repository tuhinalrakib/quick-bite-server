import asyncHandler from "express-async-handler"
import Food from "../models/Food.js"

// @desc    Create a new food item
// @route   POST /food
// @access  Private/Admin
export const createFoodItem = asyncHandler(async (req, res) => {
    const { name, price, description, category, isAvailable, rating, restaurantName } = req.body;
    const imageUrl = req.cloudinaryData || "";

    if (!imageUrl) {
        return res.status(400).json({
            success: false,
            message: "Food image is required."
        });
    }

    const food = await Food.create({
        name,
        description,
        price: Number(price),
        image: imageUrl,
        category,
        isAvailable: isAvailable !== undefined ? (isAvailable === "true" || isAvailable === true) : true,
        rating: rating ? Number(rating) : 4.0,
        restaurantName: restaurantName || "Restaurant Origin"
    });

    return res.status(201).json({
        success: true,
        message: "Food Item Created Successfully!",
        data: food
    });
});

// @desc    Get all food items
// @route   GET /food
// @access  Public
export const getAllFoodItems = asyncHandler(async (req, res) => {
    const foods = await Food.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        foods
    });
});

// @desc    Delete a food item
// @route   DELETE /food/:id
// @access  Private/Admin
export const deleteFoodItem = asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (!food) {
        return res.status(404).json({
            success: false,
            message: "Food item not found."
        });
    }

    await food.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Food Item Deleted Successfully!"
    });
});
