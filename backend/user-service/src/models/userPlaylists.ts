import mongoose, { Schema } from "mongoose";
import type { IPlaylist } from "../interfaces.js";

const userPlaylistSchema: Schema<IPlaylist> = new Schema<IPlaylist>({
    name: {
        type: String,
        required: true
    },
    songs: [
        {
            type: String,
            required: true
        }
    ]
}, {
    timestamps: true
});

const UserPlaylistModel = mongoose.model<IPlaylist>('playlist', userPlaylistSchema);

export default UserPlaylistModel;
