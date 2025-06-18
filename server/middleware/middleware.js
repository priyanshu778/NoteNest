// import jwt from 'jsonwebtoken'
// import User from '../models/user.js'

// const middleware = async (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(' ')[1];
//       if (!token) {
//         console.log("No token provided");
//         return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
//       }
  
//       const decoded = jwt.verify(token, "secretkeyofnoteapp234@#");
//       if (!decoded) {
//         console.log("Invalid token");
//         return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
//       }
  
//       const user = await User.findById(decoded.id);
//       if (!user) {
//         console.log("User not found");
//         return res.status(404).json({ success: false, message: "User not found" });
//       }
  
//       req.user = { id: user._id, name: user.name };
//       console.log("Middleware passed, user:", req.user);
//       next();
//     } catch (err) {
//       console.error("Middleware error:", err);
//       return res.status(500).json({ success: false, message: "Please log in" });
//     }
//   };
  
//   export default middleware;







import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const middleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = { id: user._id, name: user.name };
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Please log in" });
  }
};

export default middleware;