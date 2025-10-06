import express from 'express';
import { getAllSongs, getSongById, getAllAlbums, getAlbumById, getSongsByAlbumId } from './controller.js';

const router = express.Router();

router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.get('/albums', getAllAlbums);
router.get('/albums/:id', getAlbumById);
router.get('/albums/:id/songs', getSongsByAlbumId);

export { router as songsRouter };
