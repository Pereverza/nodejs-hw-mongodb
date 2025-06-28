import createHttpError from "http-errors";
import UserCollection from "../db/models/User.js";
import bcrypt from "bcrypt";
import SessionsCollection from "../db/models/session.js";
import { randomBytes } from 'crypto';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/authConstant.js';

export const registerUser = async payload => {
    const { email, password } = payload;
    const user = await UserCollection.findOne({ email });

    if (user) throw createHttpError(409, "Email already exists");
const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await UserCollection.create({ ...payload, password: hashPassword });
    return newUser;
};
export const loginUser = async ({ email, password }) => {
    const user = await UserCollection.findOne({ email });
    if (!user) throw createHttpError(401, "Email or password is invalid!")
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) throw createHttpError(401, 'Email or password is invalid!');

    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    return SessionsCollection.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + accessTokenLifetime),
      refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifetime),
    });
};
