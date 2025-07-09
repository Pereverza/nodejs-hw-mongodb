import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import SessionsCollection from '../db/models/session.js';
import { randomBytes } from 'crypto';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/authConstant.js';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { TEMPLATES_DIR, SMTP } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';
import Handlebars from 'handlebars';

const jwtSecret = getEnvVar('JWT_SECRET');
const appDomain = getEnvVar('APP_DOMAIN');
const verifyTemplatePath = join(TEMPLATES_DIR, 'verify-email.html');

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const findSession = (query) => SessionsCollection.findOne(query);

export const findUser = (query) => UserCollection.findOne(query);

export const registerUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email already exists');

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
  const templateSource = await readFile(verifyTemplatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  const html = template({
    link: `${appDomain}/auth/verify?token=${token}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Verify email',
    html,
  });

  return newUser;
};

export const verifyUser = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    return UserCollection.findOneAndUpdate(
      { email },
      { verify: true },
      { new: true },
    );
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw createHttpError(401, 'Email or password is invalid!');
  if (!user.verify) throw createHttpError(401, 'Email not verified!');

  const session = createSession();
  return SessionsCollection.create({
    userId: user._id,
    ...session,
  });
};

export const resetPassword = async ({ token, password }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UserCollection.findOne({
    email: decoded.email,
    _id: decoded.sub,
  });
  if (!user) throw createHttpError(404, 'User not found');

  const hashPassword = await bcrypt.hash(password, 10);
  await UserCollection.updateOne({ _id: user._id }, { password: hashPassword });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const oldSession = await findSession({ refreshToken, sessionId });
  if (!oldSession) throw createHttpError(401, 'Session not found!');
  if (oldSession.refreshTokenValidUntil < Date.now())
    throw createHttpError(401, 'Session token is expired!');

  await SessionsCollection.deleteOne({ _id: oldSession._id });
  const session = createSession();
  return SessionsCollection.create({
    userId: oldSession.userId,
    ...session,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  const resetToken = jwt.sign({ sub: user._id, email }, jwtSecret, {
    expiresIn: '5m',
  });

  const resetTemplatePath = join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateSource = await readFile(resetTemplatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${appDomain}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
