import TryCatch from "./helpers/TryCatch.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "./interfaces.js";
import { sql } from "./config/db.js";
import getBuffer from "./config/dataUri.js";
import { v2 as cloudinary} from 'cloudinary'

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if(user?.role !== 'admin'){
        return res.status(403).json({
            message: 'User does not have admin role'
        })
    }

    const { title, description} = req.body;
    const file = req.file

    if(!title || !description || !file){
        return res.status(401).json({
            message: 'Provide all required data'
        })
    }

    const fileBuffer = getBuffer(file);

    if(!fileBuffer || !fileBuffer.content){
        return res.status(500).json({
            message: 'Unable to generate file buffer'
        })
    }

    const thumbnail = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: 'albums'
    })

    const result = await sql`
        INSERT INTO albums (title, description, thumbnail) 
        VALUES ( ${title}, ${description}, ${thumbnail.secure_url}) RETURNING *
    `

    console.log('albums successfully created')

    return res.status(200).json({
        album: result,
        message: 'album successfully added'
    })
})

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if(user?.role !== 'admin'){
        return res.status(403).json({
            message: 'User is not admin'
        })
    }
})