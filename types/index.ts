import * as ImagePicker from "expo-image-picker";
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

export interface VideoForm {
    title: string,
    video: ImagePicker.ImagePickerAsset | null,
    thumbnail: ImagePicker.ImagePickerAsset | null,
    prompt: string;
}