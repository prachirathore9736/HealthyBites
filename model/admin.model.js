import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
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
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    },
    createdMeals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal'
    }],
}, {
    timestamps: true
});

export const Admin = mongoose.model("Admin", adminSchema);