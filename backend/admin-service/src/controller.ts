import TryCatch from "./helpers/TryCatch.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "./interfaces.js";
import { sql } from "./config/db.js";
import getBuffer from "./config/dataUri.js";
import { v2 as cloudinary} from 'cloudinary'
import { redisClient } from "./config/redisCache.js";

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if(user?.role !== 'admin'){
        return res.status(403).json({
            message: 'User does not have admin role'
        })
    }

    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log('Connected to Redis');
    }
    
    await redisClient.del('albums');

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
        data: result,
        message: 'album successfully added'
    })
})

export const addSong = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    let thumbnail;
    if(user?.role !== 'admin'){
        return res.status(403).json({
            message: 'User does not have admin role'
        })
    }

    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log('Connected to Redis');
    }

    await redisClient.del('songs');
    
    const { title, description, album_id } = req.body;

    const isAlbumPresent = await sql`
        SELECT * FROM albums WHERE id = ${album_id}
    `

    if(isAlbumPresent.length === 0){
        return res.status(404).json({
            message: 'Album not found'
        })
    }

    const files = req.files as {
        audio?: Express.Multer.File[],
        thumbnail?: Express.Multer.File[]
    };

    const audio = files?.audio?.[0];
    const thumbnailFile = files?.thumbnail?.[0];
    if(!title || !description || !audio){
        return res.status(401).json({
            message: 'Provide all required data'
        })
    }

    const fileBuffer = getBuffer(audio);

    if(!fileBuffer || !fileBuffer.content){
        return res.status(500).json({
            message: 'Unable to generate file buffer'
        })
    }

    const audioFile = await cloudinary.uploader.upload(fileBuffer.content, {
        resource_type: 'video',
        folder: 'songs'
    })

    if(thumbnailFile){
        const thumbnailBuffer = getBuffer(thumbnailFile);
        if(!thumbnailBuffer || !thumbnailBuffer.content){
            return res.status(500).json({
                message: 'Unable to generate thumbnail buffer'
            })
        }
        thumbnail = await cloudinary.uploader.upload(thumbnailBuffer.content, {
            folder: 'songs_thumbnails'
        })
    }

    const result = await sql`
        INSERT INTO songs (title, description, audio, thumbnail, album_id) 
        VALUES ( ${title}, ${description}, ${audioFile.secure_url}, ${thumbnail?.secure_url}, ${album_id}) RETURNING *
    `

    console.log('song successfully created')
    return res.status(200).json({
        data: result,
        message: 'song successfully added'
    })
})

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    const id = req.params.id;

    if(!id){   
        return res.status(400).json({
            message: 'Album id is required'
        })
    }

    if(user?.role !== 'admin'){
        return res.status(403).json({
            message: 'User is not admin'
        })
    }

    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log('Connected to Redis');
    }
    
    await redisClient.del('albums');

    const isAlbumPresent = await sql`
        SELECT * FROM albums WHERE id = ${id}
    `
    if(isAlbumPresent.length === 0){
        return res.status(404).json({
            message: 'Album not found'
        })
    }

    await sql`
        DELETE FROM albums WHERE id = ${id}
    `

    await sql`
        DELETE FROM songs WHERE album_id = ${id}
    `

    return res.status(200).json({
        message: 'Album successfully deleted'
    })
})

export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    const id = req.params.id; 

    if(!id){
        return res.status(400).json({
            message: 'Song id is required'
        })
    }

    if(user?.role !== 'admin'){
        return res.status(403).json({
            message: 'User is not admin'
        })
    }

    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log('Connected to Redis');
    }
    
    await redisClient.del('songs');

    const isSongPresent = await sql`
        SELECT * FROM songs WHERE id = ${id}
    `
    if(isSongPresent.length === 0){
        return res.status(404).json({
            message: 'Song not found'
        })
    }

    await sql`
        DELETE FROM songs WHERE id = ${id}
    `
})

export const updateAlbumThumbnail = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const id = req.params.id;
    const file = req.file
    if(!id){   
        return res.status(400).json({
            message: 'Album id is required'
        })
    }
    if(user?.role !== 'admin'){ 
        return res.status(403).json({
            message: 'User is not admin'
        })
    }

    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log('Connected to Redis');
    }
    
    await redisClient.del('albums');

    const isAlbumPresent = await sql`
        SELECT * FROM albums WHERE id = ${id}
    `
    if(isAlbumPresent.length === 0){
        return res.status(404).json({
            message: 'Album not found'
        })
    }

    if(!file){
        return res.status(400).json({
            message: 'File is required'
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
        UPDATE albums SET thumbnail = ${thumbnail.secure_url} WHERE id = ${id} RETURNING *
    `

    return res.status(200).json({
        data: result,
        message: 'Album thumbnail successfully updated'
    })
})

export const updateSongThumbnail = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const id = req.params.id;   
    const file = req.file
    if(!id){   
        return res.status(400).json({
            message: 'Song id is required'
        })
    }
    if(user?.role !== 'admin'){
        return res.status(403).json({
            message: 'User is not admin'
        })
    }
    const isSongPresent = await sql`
        SELECT * FROM songs WHERE id = ${id}
    `
    if(isSongPresent.length === 0){
        return res.status(404).json({
            message: 'Song not found'
        })
    }
    if(!file){
        return res.status(400).json({
            message: 'File is required'
        })
    }
    const fileBuffer = getBuffer(file);
    if(!fileBuffer || !fileBuffer.content){
        return res.status(500).json({
            message: 'Unable to generate file buffer'
        })
    }
    const thumbnail = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: 'songs_thumbnails'
    })
    const result = await sql`
        UPDATE songs SET thumbnail = ${thumbnail.secure_url} WHERE id = ${id} RETURNING *
    `
    return res.status(200).json({
        data: result,
        message: 'Song thumbnail successfully updated'
    })
})
