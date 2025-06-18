import express from 'express'
import User from '../models/user.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router=express.Router()


router.post('/register', async(req, res)=>{
    try{
        const {name, email, password} = req.body;
        const user= await User.findOne({email})
        if(user){
            return res.status(401).json({success:false, message:"User already Exists"})
        }
        const hashPassword= await bcrypt.hash(password,10)
        const newUser=new User({
            name, email, password:hashPassword
        })
        await newUser.save()
        return res.status(200).json({success:true, message:'Account Create SuccessFull !'})
    }
    catch(err){
        return res.status(500).json({success:false, message:'Error in Creating account !'})
    }
})


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    return res.status(200).json({
      success: true,
      token,
      user: { name: user.name },
      message: "Login successful!",
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ success: false, message: "Error during login" });
  }
});


router.get('/verify', async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
  
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, user: { name: user.name, id: user._id, email:user.email } });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error verifying token' });
    }
  });


 

export default router;