import jwt from 'jsonwebtoken';
import { Admin } from "../model/admin.model.js"
import { User } from '../model/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    // check for token in cookies
    let token = req.cookies.jwt;

    // if not in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authorization token required"
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    let errorMessage = "Authentication failed";
    if (error.name === 'TokenExpiredError') {
      errorMessage = "Session expired";
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = "Invalid token";
    }

    res.status(401).json({
      success: false,
      error: errorMessage
    });
  }
};
// middleware to check profile completion
export const checkProfileComplete = async (req, res, next) => {
  try {
    if (!req.user.profileComplete) {
      return res.status(403).json({
        error: "Profile setup required",
        redirectTo: "/profile"
      });
    }
    next();
  } catch (error) {
    console.error("Profile Check Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin Verification Error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};