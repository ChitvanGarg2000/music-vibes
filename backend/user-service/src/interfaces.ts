import { Document } from "mongoose"
import type { ObjectId } from "mongoose"
import type { Request } from "express"
export interface IUser extends Document{
    name: string,
    email: string,
    phone: number,
    password: string,
    role: string,
    playlists: ObjectId[],
    profile?: string
}

export interface RequestAuth extends Request{
    user?: IUser | null
}

export interface IPlaylist extends Document {
    name: string,
    songs: string[]
}