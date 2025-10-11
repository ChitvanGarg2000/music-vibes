import TryCatch from "./helpers/TryCatch.js";
import type { Request, Response } from "express";
import userModel from "./models/userSchema.js";
import UserPlaylistModel from "./models/userPlaylists.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { RequestAuth } from "./interfaces.js";

export const registerUser = TryCatch(async (req: Request, res: Response) => {
    const {name, password, email, role, phone, playlist, profile} = req.body

    if(!name || !password || !email || !role || !phone || !playlist) return;

    let user = await userModel.findOne({email});

    if(user){
        return res.status(400).json({
            message: "user already exist",
            success: false
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await userModel.create({
        name, password: hashedPassword, email, role, phone, playlist, profile: profile || ''
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {
        expiresIn: '7d'
    })
    res.status(200).json({
        message: 'user created successfully',
        data: user,
        token,
        success: true
    })
});

export const loginUser = TryCatch(async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if(!email) {
        return res.status(404).json({
            message: "Email not found",
            success: false
        })
    }

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(404).json({
            message: "not user found with this email",
            success: false
        })
    }

    const isValidUser = bcrypt.compare(password, user.password);

    if(!isValidUser){
        return res.status(404).json({
            message: 'Incorrect Password',
            success: false
        })
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {
        expiresIn: '7d'
    })

    return res.status(200).json({
        message: 'successfully logged in',
        data: user,
        token,
        success: true
    })
})

export const myProfile = TryCatch((req: RequestAuth, res: Response) => {
    const user = req?.user
    res.json(user)
})

export const createPlaylist = TryCatch(async (req: RequestAuth, res: Response) => {
    const user = req?.user
    const {playlist} = req.body

    if(!playlist) return res.status(400).json({
        message: "playlist is required",
        success: false
    });

    const newPlaylist = await UserPlaylistModel.create(playlist);
    const updatedUser = await userModel.findByIdAndUpdate(user?._id, {
        $push: {playlists: newPlaylist._id}
    });
    res.status(200).json({
        message: "playlist added successfully",
        data: updatedUser,
        success: true
    })
});

export const deletePlaylist = TryCatch(async (req: RequestAuth, res: Response) => {
    const user = req?.user
    const {playlist_id} = req.body 
    if(!playlist_id) return res.status(400).json({
        message: "playlist id is required",
        success: false
    });

    const playlist = await UserPlaylistModel.findById(playlist_id);

    if(!playlist) return res.status(404).json({
        message: "playlist not found",
        success: false
    });

    await UserPlaylistModel.findByIdAndDelete(playlist_id);
    const updatedUser = await userModel.findByIdAndUpdate(user?._id, {
        $pull: {playlists: playlist_id}
    });

    res.status(200).json({
        message: "playlist deleted successfully",
        data: updatedUser,
        success: true
    });
});

export const getPlaylists = TryCatch(async (req: RequestAuth, res: Response) => {
    const user = req?.user
    const populatedPlaylists = await userModel.find({user: user?._id}, 'playlists').populate('playlists');

    res.status(200).json({
        message: "playlists fetched successfully",
        data: populatedPlaylists,
        success: true
    });
});