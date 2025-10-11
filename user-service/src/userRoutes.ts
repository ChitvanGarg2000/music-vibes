import express from 'express'
import { loginUser, myProfile, registerUser, createPlaylist } from './controllers.js';
import { isAuth } from './middlewares/isAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser).
post('/login', loginUser).
get('/profile', isAuth, myProfile).
post('/create/playlist', isAuth, createPlaylist).
get('/playlists', isAuth, );

export default userRouter;