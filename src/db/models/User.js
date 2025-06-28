import { Schema, model } from "mongoose";
import { emailRegexp } from "../../constants/authConstant.js";
import { saveErrorHandler, setUpdateSettings } from './hooks.js';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: emailRegexp
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true, versionKey: false },);
userSchema.post("save", saveErrorHandler);
userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', saveErrorHandler);

const UserCollection = model('User', userSchema);
export default UserCollection;
