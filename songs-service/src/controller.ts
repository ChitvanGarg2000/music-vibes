import TryCatch from "./helpers/TryCatch.js";
import type { Request, Response } from "express";
import { sql } from "./utils/db.js";
import { redisClient } from "./utils/redisCache.js";

export const getAllSongs = TryCatch(async (req: Request, res: Response) => {
    if(!redisClient.isOpen){
        await redisClient.connect();
        const songs = await redisClient.get('songs');
        if(songs){
            console.log('songs retrieved from cache')
            return res.status(200).json({
                data: JSON.parse(songs),
                message: 'songs retrieved from cache'
            })
        }
    }

    const songs = await sql`SELECT * FROM songs`;
    await redisClient.set('songs', JSON.stringify(songs), {EX: 3600});
    console.log('songs retrieved from database')
    res.status(200).json({
        data: songs,
        message: 'songs retrieved from database'
    });
})

export const getSongById = TryCatch(async (req: Request, res: Response) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).json({
            message: 'Song id is required'
        })
    }
    const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
    if(!song){
        return res.status(404).json({
            message: 'Song not found'
        })
    }
    res.status(200).json({
        data: song,
        message: 'Song retrieved successfully'
    });
})

export const getAllAlbums = TryCatch(async (req: Request, res: Response) => {
    if(!redisClient.isOpen){
        await redisClient.connect();
        const albums = await redisClient.get('albums');
        if(albums){
            console.log('albums retrieved from cache');
            return res.status(200).json({
                data: JSON.parse(albums),
                message: 'albums retrieved from cache'
            })
        }
    }

    const albums = await sql`SELECT * FROM albums`;
    await redisClient.set('albums', JSON.stringify(albums), {EX: 3600});
    console.log('albums retrieved from database');
    res.status(200).json({
        data: albums,
        message: 'albums retrieved from database'
    });
});

export const getAlbumById = TryCatch(async (req: Request, res: Response) => {
    const id = req.params.id;   
    if(!id){
        return res.status(400).json({
            message: 'Album id is required'
        })
    }
    const album = await sql`SELECT * FROM albums WHERE id = ${id}`;
    if(!album){
        return res.status(404).json({
            message: 'Album not found'
        })
    }
    return res.status(200).json({
        data: album,
        message: 'Album retrieved successfully'
    });
});

export const getSongsByAlbumId = TryCatch(async (req: Request, res: Response) => {
    const album_id = req.params.id;
    if(!album_id){
        return res.status(400).json({
            message: 'Album id is required'
        })
    }
    const songs = await sql`SELECT * FROM songs WHERE album_id = ${album_id}`;
    if(songs.length === 0){
        return res.status(404).json({
            message: 'No songs found for this album'
        });
    }
    return res.status(200).json({
        data: songs,
        message: 'Songs retrieved successfully'
    });
});
