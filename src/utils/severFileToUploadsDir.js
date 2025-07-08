import { rename } from "node:fs/promises";
import { UPLOADS_DIR } from "../constants/index.js";
import { join } from "node:path";

export const saveFileToUploadsDir = async file => {
    const { path: oldPath, filename } = file;
    const newPath = join(UPLOADS_DIR, filename);
    rename(oldPath, newPath);
    return filename;
}
