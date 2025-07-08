import {v2 as cloudinary} from 'cloudinary';
import { unlink } from "node:fs/promises";
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

const cloud_name = getEnvVar(CLOUDINARY.CLOUD_NAME);
const api_key = getEnvVar(CLOUDINARY.API_KEY);
const api_secret = getEnvVar(CLOUDINARY.API_SECRET);

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
});

export const saveFileToCloudinary = async (file) => {
    const { secure_url } = await cloudinary.uploader.upload(file.path, {
        folder: "uploads",
        use_filename: true,
    });
    await unlink(file.path);
    return secure_url;
}
