import express from 'express'
import { isAuth } from './middlewares/middleware.js';
import { addAlbum } from './controller.js';
import uploadFile from './middlewares/media.js';

export const adminRouter = express.Router();

adminRouter.post('/add-album', isAuth, uploadFile, addAlbum)
