import TryCatch from "./helpers/TryCatch.js";
import type { Request, Response } from "express";
import userModel from "./models/userSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { RequestAuth } from "./interfaces.js";

export const registerUser = TryCatch(async (req: Request, res: Response) => {
    const {name, password, email, role, phone, playlist} = req.body

    if(!name || !password || !email || !role || !phone || !playlist) return;

    let user = await userModel.findOne({email});

    if(user){
        return res.status(400).json({
            message: "user already exist",
            success: false
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await userModel.create({
        name, password: hashedPassword, email, role, phone, playlist
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {
        expiresIn: '7d'
    })
    res.status(200).json({
        message: 'user created successfully',
        data: user,
        token,
        success: true
    })
});

export const loginUser = TryCatch(async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if(!email) {
        return res.status(404).json({
            message: "Email not found",
            success: false
        })
    }

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(404).json({
            message: "not user found with this email",
            success: false
        })
    }

    const isValidUser = bcrypt.compare(password, user.password);

    if(!isValidUser){
        return res.status(404).json({
            message: 'Incorrect Password',
            success: false
        })
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {
        expiresIn: '7d'
    })

    return res.status(200).json({
        message: 'successfully logged in',
        data: user,
        token,
        success: true
    })
})

export const myProfile = TryCatch((req: RequestAuth, res: Response) => {
    const user = req?.user
    res.json(user)
})