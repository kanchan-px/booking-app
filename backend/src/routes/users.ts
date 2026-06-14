import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { check } from "express-validator";
import { validationResult } from "express-validator";

const router = express.Router();

router.post("/register",[
  check("firstName", "First name is required").isString().notEmpty(),
  check("lastName", "Last name is required").isString().notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      {
        userID: user.id,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(200).send({
      message: "User registered OK",
    });
    
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error registering user",
    });
  }
});

export default router;