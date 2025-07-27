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
    origin: "http://localhost:3001",
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_ATLAS_URL)
    .then(() => {
        console.log("MongoDB Atlas Connected");
        app.use("/admin", AdminRouter);
        app.use("/user", UserRouter);
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server Started at ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Database connection failed", err);
    });
