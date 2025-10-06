import express from 'express'
import { loginUser, myProfile, registerUser } from './controllers.js';
import { isAuth } from './middlewares/isAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser).
post('/login', loginUser).
get('/profile', isAuth, myProfile)

export default userRouter;