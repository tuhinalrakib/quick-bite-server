import asyncHandler from "express-async-handler"
import Food from "../models/Food.js"

export const createFoodItem = asyncHandler(async (req, res) => {
    console.log(req.body)
    // const { name, price, description } = req.body
    // console.log(name, price, description)

    // const imageUrl = req.cloudinaryData || "";
    // console.log(imageUrl)

    return res.status(201).json({
        success: true,
        message: "Food Item Created Successfully!"
    })
})

// export const getAllFoodItems = asyncHandler(async (req, res) => {
//     const foods = await Food.find()

//     return res.status(200).json({
//         success : true,
//         foods
//     })
// })