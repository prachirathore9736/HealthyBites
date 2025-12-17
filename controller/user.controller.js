import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import { Admin } from "../model/admin.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { Meal } from "../model/meal.model.js";
import { OAuth2Client } from "google-auth-library";
// import admin from "../middlewares/firebaseAdmin.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
dotenv.config();

const otpStore = new Map();

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// export const googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) return res.status(400).json({ error: "Token is required" });

//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const { email, name, picture, uid } = decodedToken;

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         username: name || "Google User",
//         email,
//         googleId: uid,
//         avatar: picture,
//         password: "googleuser",
//         contact: 0,
//         verified: true,
//         isLoggedIn: true,
//         profileComplete: false,
//         role: "user"
//       });
//     } else {
//       user.isLoggedIn = true;
//       await user.save();
//     }

//     const authToken = jwt.sign(
//       { userId: user._id, email: user.email, role: user.role, profileComplete: user.profileComplete },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("jwt", authToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000
//     });

//     res.status(200).json({
//       message: `Welcome ${user.username}`,
//       token: authToken,
//       user: {
//         email: user.email,
//         username: user.username,
//         role: user.role
//       },
//       profileComplete: user.profileComplete
//     });

//   } catch (error) {
//     console.error("Google Sign-In Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const checkProfileComplete = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.profileComplete) {
      return res.status(403).json({
        error: "Profile setup required",
        redirectTo: "/profile-setup"
      });
    }

    next();
  } catch (error) {
    console.error("Profile Check Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateMealPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.preferences) {
      return res.status(404).json({ error: "User or preferences not found" });
    }

    const { preferredDiet, allergies, meals } = user.preferences;

    const allValidMeals = await Meal.find({
      dietType: preferredDiet,
      "ingredients.name": { $nin: allergies }
    }).select("name calorie nutrients recipe ingredients imageUrl");

    if (allValidMeals.length < meals.length) {
      return res.status(404).json({ error: "Not enough meals for meal plan" });
    }

    const shuffled = allValidMeals.sort(() => 0.5 - Math.random());

    const plan = {};
    meals.forEach((mealType, index) => {
      const meal = shuffled[index];
      plan[mealType] = {
        name: meal.name,
        calories: meal.calorie,
        protein: meal.nutrients?.protein || 0,
        carbs: meal.nutrients?.carbs || 0,
        fats: meal.nutrients?.fats || 0,
        imageUrl: meal.imageUrl,
        ingredients: meal.ingredients,
        recipe: meal.recipe
      };
    });

    return res.status(200).json({
      message: "Here is your personalized meal plan",
      plan,
      preferences: { meals }
    });

  } catch (error) {
    console.error("Meal Plan Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture, uid } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name || "Google User",
        email,
        googleId: uid,
        avatar: picture,
        password: "googleuser",
        verified: true,
        isLoggedIn: true,
        profileComplete: false,
        role: "user"
      });
    } else {
      user.isLoggedIn = true;
      await user.save();
    }

    const authToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    res.cookie("jwt", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: `Welcome ${user.username}`,
      token: authToken,
      user: {
        email: user.email,
        username: user.username,
        role: user.role
      },
      profileComplete: user.profileComplete
    });

  } catch (err) {
    console.error("Google Sign-In Error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// export const signUpAction = async (request, response, next) => {
//   try {
//     const error = validationResult(request);
//     console.log(error,"error");
//     console.log(request.body,"request");
//     if (!error.isEmpty())
//       return response.status(401).json({ error: "Bad request | Invalid data", errorDetails: error.array() });

//     let { password, email } = request.body;
//     let saltKey = bcrypt.genSaltSync(12);
//     password = bcrypt.hashSync(password, saltKey);
//     request.body.password = password;

//     const otp = generateOTP();
//     const expiry = Date.now() + 5 * 60 * 1000;
//     otpStore.set(email, { otp, expiry, attempts: 0 });

// //     const emailStatus = await sendEmailWithOTP(email, otp);
// //     if (!emailStatus) {
// //   console.log("Error: OTP email sending failed.");
// //   return response.status(500).json({ message: "Failed to send OTP" });
// // }

// //     const userExists = await User.findOne({ email });
// // if (userExists) {
// //   return response.status(400).json({ error: "User already exists" });
// // }
// // const result = emailStatus && await User.create(request.body);
// //  console.log("User Created Successfully: ", result);
// //     return response.status(201).json({ message: "OTP sent to email for verification. Verify your Email", userDetail: result });
// //   } catch (err) {
// //     console.log(err);
// //     return response.status(500).json({ error: "Internal Server Error" });
// //   }
// // };
// try {
//       await sendEmailWithOTP(email, otp);
//     } catch (emailError) {
//       console.log("Email Sending Failed:", emailError);
//       return response.status(500).json({ 
//         error: "Failed to send OTP", 
//         details: emailError.message // Frontend ko asli error dikhega
//       });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return response.status(400).json({ error: "User already exists" });
//     }
    
//     const result = await User.create(request.body);
//     console.log("User Created Successfully: ", result);
    
//     return response.status(201).json({ message: "OTP sent to email for verification. Verify your Email", userDetail: result });
  
//   } catch (err) {
//     console.log("Main Controller Error:", err);
//     return response.status(500).json({ error: "Internal Server Error", details: err.message });
//   }
// };

export const signUpAction = async (request, response) => {
  try {
    const error = validationResult(request);
    console.log(error, "error");
    console.log(request.body, "request");

    if (!error.isEmpty()) {
      return response.status(401).json({
        error: "Bad request | Invalid data",
        errorDetails: error.array(),
      });
    }

    let { password, email } = request.body;

    // Password hashing
    let saltKey = bcrypt.genSaltSync(12);
    password = bcrypt.hashSync(password, saltKey);
    request.body.password = password;

    // OTP generate + store
    const otp = generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiry, attempts: 0 });

    // Email sending
    try {
      await sendEmailWithOTP(email, otp);
    } catch (emailError) {
      console.log("Email Sending Failed:", emailError);
      return response.status(500).json({
        error: "Failed to send OTP",
        details: emailError.message,
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return response.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const result = await User.create(request.body);
    console.log("User Created Successfully:", result);

    return response.status(201).json({
      message: "OTP sent to email for verification.",
      userDetail: result,
    });

  } catch (err) {
    console.log("Main Controller Error:", err);
    return response.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
};


export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.verified) return res.status(400).json({ error: "User already verified" });

    const otp = generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiry, attempts: 0 });

    const emailStatus = await sendEmailWithOTP(email, otp);
    if (emailStatus) {
      return res.status(200).json({ message: "OTP resent to your email." });
    } else {
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.verified) return res.status(400).json({ error: "User already verified" });

    const savedOTP = otpStore.get(email);
    if (!savedOTP) return res.status(400).json({ error: "OTP not found or expired" });

    if (savedOTP.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (savedOTP.expiry < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    user.verified = true;
    user.profileComplete = false;
    await user.save();
    otpStore.delete(email);

    // generate jwt token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // set http-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Account verified successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username
      },
      profileComplete: user.profileComplete
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signInAction = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (admin) {
      if (admin.password !== password) {
        return res.status(401).json({ error: "Invalid credentials: wrong password" });
      }

      const token = jwt.sign(
        { adminId: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        },
        message: "Welcome Admin"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials: user not found" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials: Wrong password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, profileComplete: user.profileComplete },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      profileComplete: user.profileComplete
    });

  } catch (error) {
    console.error("Sign In Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



export const forgotPasswordAction = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword)
    return res.status(400).json({ message: "All fields are required" });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {
    let user = await User.findOne({ email });
    if (user) {
      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    }

    return res.status(404).json({ message: "User not found with this email" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendEmailWithOTP(toEmail, otp) {
  return new Promise((resolve, reject) => {
    // let transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.GMAIL_ID,
    //     pass: process.env.GMAIL_PASSWORD
    //   },
    //   connectionTimeout: 1000000, // 10 seconds
    //   greetingTimeout: 5000,
    //   socketTimeout: 10000
    // });
let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',  // <--- Explicit host
      port: 587,               // <--- CHANGE THIS to 587
      secure: false,           // <--- CHANGE THIS to false (required for port 587)
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD
      },
      connectionTimeout: 10000, // Reduced to 10s is safer
    });

    let mailOptions = {
      from: process.env.GMAIL_ID,
      to: toEmail,
      subject: 'Account OTP',
      html: `<h4>Dear user,</h4>
            <p>Your OTP is:</p>
            <h2>${otp}</h2>
            <p>This OTP is valid for 2 minutes.</p>
            <b>Healthy Bites</b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error while sending mail: ", error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
}

export const logoutAction = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.isLoggedIn = false;
    await user.save();

    // clear jwt cookie
    res.clearCookie('jwt');

    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const setPreferences = async (req, res) => {
  try {
    const user = req.user;

    const { preferredDiet, bodyFatLevel, goal, meals, weight, allergies = [] } = req.body;

    if (!preferredDiet || !bodyFatLevel || !goal || !meals || !weight) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const numericWeight = Number(weight);
    if (isNaN(numericWeight) || numericWeight <= 0 || numericWeight > 200) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be a number between 1 and 200'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        preferences: { preferredDiet, allergies, weight: numericWeight, bodyFatLevel, goal, meals },
        profileComplete: true
      },
      { new: true, runValidators: true }
    );

    const token = jwt.sign(
      { userId: updatedUser._id, email: updatedUser.email, role: updatedUser.role, profileComplete: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Preferences saved successfully',
      token,
      preferences: updatedUser.preferences
    });

  } catch (error) {
    console.error('Error saving preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const userProfile = req.user.toObject();
    delete userProfile.password;
    delete userProfile.__v;

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @description Updates the profile and preferences for the authenticated user. This is a single, consolidated endpoint.
 */
export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, contact, preferences } = req.body;

    const updateData = {
      username,
      contact,
      preferences,
      profileComplete: true
    };

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select('-password -__v');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
