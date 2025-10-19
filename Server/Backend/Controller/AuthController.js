const userModel = require("../Models/User")
const bcrypt = require('bcrypt')


const signup = async(req, res) => {
  try {
    const { name,college,email,password } = req.body;
    const search = await userModel.findOne({email});
    if( search ) {
      res.status(400).json({message: "User already exists", sucess: false});
    }

    const user = new userModel({name, college, email, password});
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(201).json({message: "Signed up sucessfully", success:true});
  } catch (err) {
    res.status(500).json({message: "Interal server error", success: false});
  }
}

const login = (req, res) => {
  try {

  } catch (err) {

  }
}

module.exports = {
  signup,
  login
}