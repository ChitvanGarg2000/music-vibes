import mongoose, {Schema} from "mongoose";
import type { IUser } from "../interfaces.js";

const userSchema: Schema<IUser> = new Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        index: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    phone: {
        type: Number,
        required: true,
        maxLength: 10,
        minLength: 6,
        unique: true,
        index: true
    },
    role: {
        type: String,
        required: true
    },
    playlist: [
        {
            type: String,
        }
    ]
}, {
    timestamps: true
});

const userModel = mongoose.model<IUser>('user', userSchema);

export default userModel;