import { Models } from "react-native-appwrite";

export interface VideoData extends Models.Document {
    title: string;
    thumbnail: string;
    video: string;
    creator: {
        username: string;
        avatar: string;
    };
}