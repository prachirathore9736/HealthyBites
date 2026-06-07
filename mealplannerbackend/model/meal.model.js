import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dietType: {
        type: String,
        enum: ['vegan', 'vegetarian', 'keto', 'paleo', 'anything', 'mediterranean'],
        required: true
    },
    calorie: Number,
    nutrients: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    },
    ingredients: [{
        name: String,
        quantity: String
    }],
    recipe: String,
    timeRequired: Number,
    imageUrl: {
        type: String,
        required: true,
        default: "https://i.pinimg.com/736x/06/d4/0f/06d40f08229f68a0547934846f00051a.jpg"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

export const Meal = mongoose.model('Meal', mealSchema);
