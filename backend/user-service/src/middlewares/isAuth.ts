import type { Response, NextFunction } from "express"
import jwt, { type JwtPayload } from 'jsonwebtoken'
import userModel from "../models/userSchema.js";
import { type RequestAuth } from "../interfaces.js";
export const isAuth = async (req: RequestAuth, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const token = req.headers.token as string;

        if(!token){
            res.status(403).json({
                message: 'Please login'
            })
            return
        }

        const userInfo = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if(!userInfo || !userInfo.id){
            res.status(403).json({
                message: 'Invalid token'
            })
            return;
        }

        const user = await userModel.findById(userInfo.id).select("-password");

        if(!user){
            res.status(404).json({
                message: 'User not found'
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}