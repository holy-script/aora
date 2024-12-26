import * as DocumentPicker from "expo-document-picker";
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
    video: DocumentPicker.DocumentPickerAsset | null,
    thumbnail: DocumentPicker.DocumentPickerAsset | null,
    prompt: string;
}