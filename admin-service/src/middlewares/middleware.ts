import type { Response, NextFunction } from "express"
import axios from 'axios'
import type { AuthenticatedRequest } from "../interfaces.js";


export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.token as string;

        console.log({token})

        if(!token){
            res.status(403).json({
                message: 'Please login first'
            })
            return
        }

        const user = await axios.get(`${process.env.USER_SERVICE_URI}api/v1/user/profile`, {
            headers: {
                token
            }
        })

        if(!user){
            res.status(404).json({
                message: 'user not found'
            })
            return
        }

        const { data } = user;

        console.log({data})

        req.user = data;
        next()
    } catch (error) {
        console.log(error)
    }
}