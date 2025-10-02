import { Document } from "mongoose"
import type { Request } from "express"
export interface IUser extends Document{
    name: string,
    email: string,
    phone: number,
    password: string,
    role: string,
    playlist: string[]
}

export interface RequestAuth extends Request{
    user?: IUser | null
}