import { type Request } from "express"
export interface IUser{
    _id: string,
    name: string,
    email: string,
    phone: number,
    password: string,
    role: string,
    playlist: string[]
}

export interface AuthenticatedRequest extends Request{
    user?: IUser | null
}