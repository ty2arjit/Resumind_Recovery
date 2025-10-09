const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const JWT_Key = process.env.JWT_KEY;


// Test route that doesn't require MongoDB
router.post("/test-signup", async (req, res) => {
  const {name, college, email, password} = req.body;

  try {
    // Simulate successful signup without database
    const mockUser = {
      _id: "mock-user-id",
      name,
      college,
      email,
      password: "hashed_password"
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: mockUser._id},
      JWT_Key || "fallback-secret-key",
      {
        expiresIn: "1d",     
      }
    );

    res.status(201).json({
      message: "Test user created Successfully",
      user: mockUser,
      token: token
    });
  } catch (err) {
    console.error("Test signup error:", err);
    res.status(500).json({ error: "Test server error" });
  }
});

// Sign Up Route
router.post("/signup", async (req, res) => {
  const {name, college, email, password} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ error: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await User.create({
      name,
      college,
      email,
      password: hashedPassword,
    });

    // Generate JWT token for signup
    const token = jwt.sign(
      { id: newUser._id},
      JWT_Key,
      {
        expiresIn: "1d",     
      }
    );

    res.status(201).json({
      message: "User created Successfully",
      user: newUser,
      token: token
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Sign in Route

router.post("/signin", async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({
        error: "User not found."
      })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({
        error: "Incorrect Password."
      })
    }
    const token = jwt.sign(
      { id: user._id},
      JWT_Key,
      {
        expiresIn: "1d",     
      }
    );

    res.status(200).json({
      message: "Logged in Successfully",
      token,
      user,
    })
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Server error" });
  }
})




module.exports = router;
