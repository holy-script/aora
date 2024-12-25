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

import { VideoData } from '@/types';
import { Account, AppwriteException, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

const client = new Client();

client
    .setEndpoint(endpoint)
    .setPlatform(platform)
    .setProject(projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

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