import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import UserRouter from "./routes/user.route.js";
import AdminRouter from "./routes/admin.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3001",                       
        "https://healthybitesfrontend.onrender.com"    
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Core API Route Registration
app.use("/admin", AdminRouter);
app.use("/user", UserRouter);

// Database Connection Handling
mongoose.connect(process.env.MONGO_ATLAS_URL)
    .then(() => {
        console.log("MongoDB Atlas Connected Successfully");
    })
    .catch(err => {
        console.error("Database connection failed directly:", err.message);
        console.log("Attempted URI Key Value was:", process.env.MONGO_ATLAS_URL ? "DEFINED" : "UNDEFINED/MISSING");
    });

// Unconditional Port Binding to pass Render Health Checks
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});