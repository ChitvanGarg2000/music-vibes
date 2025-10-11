import express from 'express'
import { isAuth } from './middlewares/middleware.js';
import { addAlbum, addSong, deleteAlbum, deleteSong, updateAlbumThumbnail, updateSongThumbnail } from './controller.js';
import {uploadFile, uploadMultipleFiles} from './middlewares/media.js';

export const adminRouter = express.Router();

adminRouter.post('/add-album', isAuth, uploadFile, addAlbum).
post('/add-song', isAuth, uploadMultipleFiles, addSong).
delete('/delete-album/:id', isAuth, deleteAlbum).
delete('/delete-song/:id', isAuth, deleteSong).
patch('/update-album-thumbnail/:id', isAuth, uploadFile, updateAlbumThumbnail).
patch('/update-song-thumbnail/:id', isAuth, uploadFile, updateSongThumbnail)
