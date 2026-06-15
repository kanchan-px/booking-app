import express, { Request, Response } from "express";
import {check} from "express-validator";
import { validationResult } from "express-validator";
import  User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/login",[
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password with at least 6 characters is required").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({
      userID: user.id,
    }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1d",
    })

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    })

    res.status(200).json({
      userID: user.id,
    });

  } catch(error) {
    console.log(error);
    res.status(500).json({
      message: "Error logging in user",
    });
  }
});

router.get("/validate-token",verifyToken, (req: Request, res: Response) => {
  res.status(200).json({
    userID: req.userId,
  });
});

export default router;