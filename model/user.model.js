import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number
    },
    verified: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profileComplete: {
        type: Boolean,
        default: false
    },
    preferences: {
        preferredDiet: { type: String, enum: ['vegan', 'vegetarian', 'keto', 'paleo', 'anything', 'mediterranean'] },
        allergies: [{ type: String, enum: ['gluten', 'peanut', 'eggs', 'fish', 'soy', 'shellfish', 'treenuts'] }],
        weight: { type: Number, min: 0 },
        bodyFatLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
        goal: { type: String, enum: ['Weight Loss', 'Gain', 'Maintain'] },
        meals: [{ type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] }]
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);