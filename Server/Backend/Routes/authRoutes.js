const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User");

dotenv.config();
const router = express.Router();
const JWT_Key = process.env.JWT_KEY;


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

    res.status(201).json({
      message: "User created Successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error "});
  }
});

// // Sign in Route

// router.post("/signin", async (req, res) => {
//   const {email, password} = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if(!user) {
//       return res.status(400).json({
//         error: "User not found."
//       })
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if(!isMatch) {
//       return res.status(400).json({
//         error: "Incorrect Password."
//       })
//     }
//     const token = jwt.sign(
//       { id: user._id},
//       JWT_Key,
//       {
//         expiresIn: "1d",     
//       }
//     );

//     res.status(200).json({
//       message: "Logged in Successfully",
//       token,
//       user,
//     })
//   } catch (err) {
//     res.status(500).json({ error: "Server error "});
//   }
// })

// // Adding data to history

// app.post("/adding-score", async (req,res) => {
//   const { userId, score } = req.body;
  
//   if(!userId) {
//     return res.status(400).json({ error: "User not found. "});
//   }
//   if( score === undefined) {
//     return res.status(400).json({ error: "Missing Data."})
//   }

//   try {
//     const user = User.findById(userId);
//     if(!user) {
//       return res.status(400).json({ error: "User not found."})
//     }

//     user.history.push({ score, date: new Date() });

//     await user.save();

//     req.status(200).json({ message: "Score added to history."});
//   } catch (err) {
//     res.status(500).json({ error: "Server error."});
//   }
// });

// // Fetching data from history

// app.get("/get-history:/userId", async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);

//     if(!user) {
//       return res.status(400).json({ error: "User not found."});
//     }

//     res.status(200).json({history: user.history});
//   } catch (err) {
//     res.status(500).json({ error: "Server error."});
//   }
// });



// module.exports = router;
