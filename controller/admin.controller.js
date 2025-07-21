import { Admin } from "../model/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { Meal } from "../model/meal.model.js";

export const saveMealsInBulk = async (req, res) => {
  try {
    const meals = req.body.map(meal => ({
      ...meal,
      imageUrl: meal.imageUrl || "https://i.pinimg.com/736x/06/d4/0f/06d40f08229f68a0547934846f00051a.jpg",
      createdBy: req.admin._id
    }));

    const result = await Meal.insertMany(meals);

    await Admin.findByIdAndUpdate(
      req.admin._id,
      { $push: { createdMeals: { $each: result.map(m => m._id) } } }
    );

    return res.status(201).json({
      message: `${result.length} meals saved successfully`,
      count: result.length
    });
  } catch (err) {
    console.error("Bulk Save Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createMeal = async (req, res) => {
  try {
    const mealData = {
      name: req.body.name,
      dietType: req.body.dietType || 'anything',
      calorie: req.body.calories || 0,
      nutrients: {
        protein: req.body.protein || 0,
        carbs: req.body.carbs || 0,
        fats: req.body.fat || 0
      },
      ingredients: req.body.ingredients || [],
      recipe: req.body.description || '',
      timeRequired: req.body.timeRequired || 30,
      imageUrl: req.body.imageUrl || "https://i.pinimg.com/736x/06/d4/0f/06d40f08229f68a0547934846f00051a.jpg",
      createdBy: req.admin._id
    };

    const meal = new Meal(mealData);
    await meal.save();

    await Admin.findByIdAndUpdate(
      req.admin._id,
      { $push: { createdMeals: meal._id } }
    );

    res.status(201).json(meal);
  } catch (error) {
    console.error("Create Meal Error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ error: "Meal not found" });
    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const updatedMeal = {
      name: req.body.name,
      dietType: req.body.dietType || 'anything',
      calorie: req.body.calories || 0,
      nutrients: {
        protein: req.body.protein || 0,
        carbs: req.body.carbs || 0,
        fats: req.body.fat || 0
      },
      ingredients: req.body.ingredients || [],
      recipe: req.body.description || '',
      timeRequired: req.body.timeRequired || 30,
      imageUrl: req.body.imageUrl || "https://i.pinimg.com/736x/06/d4/0f/06d40f08229f68a0547934846f00051a.jpg"
    };

    const meal = await Meal.findByIdAndUpdate(req.params.id, updatedMeal, {
      new: true,
      runValidators: true
    });

    if (!meal) return res.status(404).json({ error: "Meal not found" });
    res.json(meal);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);

    if (!meal) return res.status(404).json({ error: "Meal not found" });

    await Admin.findByIdAndUpdate(
      req.admin._id,
      { $pull: { createdMeals: meal._id } }
    );

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate jwt token
    const token = jwt.sign(
      { adminId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      token
    });

  } catch (error) {
    console.error("Admin SignIn Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};