import multer from "multer";
import { TEMP_DIR } from "../constants/index.js";
import createHttpError from "http-errors";

const storage = multer.diskStorage({
    destination: TEMP_DIR,
    filename: (req, file, cb) =>{
        const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePreffix}_${file.originalname}`;
        cb(null, filename);
    }
});
const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split(".").pop();
    if (extension == "exe") {
       return cb(createHttpError(400, "exe not allow file format"));
    }
    cb(null, true);
}
export const upload = multer({
    storage,
    fileFilter,
})

