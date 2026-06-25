import asyncHandler from "express-async-handler"
import Food from "../models/Food.js"
import { deleteFoodCache, getFoodCache, setFoodCache } from "../services/caching/foodCaching.js";

// @desc    Create a new food item
// @route   POST /food
// @access  Private/Admin
export const createFoodItem = asyncHandler(async (req, res) => {
    const { name, price, description, category } = req.body;
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
        restaurantName: "Restaurant Origin"
    });

    await deleteFoodCache()

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
    const cachKey = JSON.stringify("allFoods");

    const cachedAllFoods = await getFoodCache(cachKey)
    if(cachedAllFoods){
        return res.status(200).json({
            success : true,
            foods : cachedAllFoods
        })
    }

    const foods = await Food.find().sort({ createdAt: -1 });
    await setFoodCache(cachKey, foods)

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
    await deleteFoodCache()

    return res.status(200).json({
        success: true,
        message: "Food Item Deleted Successfully!"
    });
});

// @desc    Update a food item
// @route   PUT /food/:id
// @access  Private/Admin
export const updateFoodItem = asyncHandler(async (req, res) => {
    const { name, price, description, category, isAvailable } = req.body;
    const food = await Food.findById(req.params.id);

    if (!food) {
        return res.status(404).json({
            success: false,
            message: "Food item not found."
        });
    }

    if (name) food.name = name;
    if (description) food.description = description;
    if (price !== undefined) food.price = Number(price);
    if (category) food.category = category;
    if (isAvailable !== undefined) {
        food.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    if (req.cloudinaryData) {
        food.image = req.cloudinaryData;
    }

    await food.save();
    await deleteFoodCache();

    return res.status(200).json({
        success: true,
        message: "Food Item Updated Successfully!",
        data: food
    });
});
