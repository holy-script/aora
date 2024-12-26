export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.anonymous.aora',
    projectId: '6758eeab001fecca9591',
    databaseId: '6758f14b00014190dbb6',
    userCollectionId: '6758f183003b0e030d05',
    videoCollectionId: '6758f19b0039624ca88a',
    storageId: '6758f2f5003d60857430',
};

const { endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId } = config;

import { VideoData, VideoForm } from '@/types';
import * as DocumentPicker from 'expo-document-picker';
import { Account, AppwriteException, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';

const client = new Client();

client
    .setEndpoint(endpoint)
    .setPlatform(platform)
    .setProject(projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
    email: string,
    password: string,
    username: string,
) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        );

        if (!newAccount) {
            throw new Error('Failed to create user');
        }

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );

        return newUser;
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const signIn = async (
    email: string,
    password: string,
) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) {
            throw new Error('Failed to get logged in user');
        }

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) {
            throw new Error('Failed to get current user data');
        }

        return currentUser.documents[0];
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );

        if (!posts) {
            throw new Error('Failed to get posts');
        }

        return posts.documents as VideoData[];
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(7)
            ]
        );

        if (!posts) {
            throw new Error('Failed to get posts');
        }

        return posts.documents as VideoData[];
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const searchPosts = async (query: string) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        );

        if (!posts) {
            throw new Error('Failed to get posts');
        }

        return posts.documents as VideoData[];
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const getUserPosts = async (userId: string) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        );

        if (!posts) {
            throw new Error('Failed to get posts');
        }

        return posts.documents as VideoData[];
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
    } catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const getFilePreview = async (fileId: string, type: 'image' | 'video') => {
    let fileUrl: URL;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(
                storageId,
                fileId,
            );
        }
        else if (type === "image") {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000,
                2000,
                ImageGravity.Top,
                100
            );
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) {
            throw new Error('Failed to get file preview');
        }

        return fileUrl;
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const uploadFile = async (file: DocumentPicker.DocumentPickerAsset, type: 'image' | 'video') => {
    if (!file) {
        throw new Error('No file selected');
    }

    if (!file.mimeType || !file.size) {
        throw new Error('Invalid file');
    }

    const { mimeType, size, ...rest } = file;
    const asset = {
        name: rest.name,
        type: mimeType,
        size: size,
        uri: rest.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset,
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};

export const createVideo = async (form: VideoForm & { userId: string; }) => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
        throw new Error('Please fill all fields');
    }

    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );
    }
    catch (error) {
        console.error(error as AppwriteException);
        throw new Error((error as AppwriteException).message);
    }
};