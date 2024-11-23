import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";



export const protect = async (req, res, next) => {
  // console.log("User token headers =>", req.headers);
  
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, token missing' });
  }
  
  try {
    // console.log("Token: ", token);
    // console.log("Secret Key: ", process.env.SECRET_KEY);
    
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("Decoded Token: ", decoded);
    
    req.user = await User.findById(decoded.userId); // Adjust key if needed
    if (!req.user) {
      console.log("No user found with this ID: ", decoded.userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    next();
  } catch (err) {
    console.error("JWT Error: ", err.message);
    return res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};



export const loginMiddleware = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Bearer scheme
      if (!token) return res.status(401).send({ ok: false, message: "No token provided" });
  
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decode;
      next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      return res.status(401).send({ ok: false, message: "Invalid or expired token" });
    }
  };