import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import SessionsCollection from '../db/models/session.js';
import { randomBytes } from 'crypto';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/authConstant.js';
import jwt from "jsonwebtoken";
import { join } from "node:path";
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import { SMTP } from '../constants/index.js';
import path from 'node:path';

const jwtSecret = getEnvVar("JWT_SECRET");
const appDomian = getEnvVar("APP_DOMAIN");
const verifyTemplatePath = join(TEMPLATES_DIR, "verify-email.html");

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
  const jwtPayload = {
    email,
  };

  const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '1h' });
  const templateSource = await readFile(verifyTemplatePath, "utf-8");
  const template = Handlebars.compile(templateSource);
  const html = template({
    link: `${appDomian}/auth/verify?token=${token}`,
  });

  const verifyEmail = {
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Verify  email',
    html,
  };
  await sendEmail(verifyEmail);

  return newUser;
};

export const verifyUser = token => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    return UserCollection.findOneAndUpdate({ email }, { verify: true }, { new: true });
  }
  catch (error) {
throw createHttpError(401, error.message);
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is invalid!');
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare)
    throw createHttpError(401, 'Email or password is invalid!');

  if(!user.verify) throw createHttpError(401, 'Email not verified!');
  const session = createSession();

  return SessionsCollection.create({
    userId: user._id,
    ...session,
  });
};
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
export const refreshUser = async ({ refreshToken, sessionId }) => {
  const oldSession = await findSession({ refreshToken, sessionId });
  if (!oldSession) throw createHttpError(401, 'Session not found!');

  if (oldSession.refreshTokenValidUntil < Date.now())
    throw createHttpError(401, 'Session token is expired!');

  await SessionsCollection.findOneAndDelete({ _id: oldSession._id });
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

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

   const resetTemplatePath = path.join(
     TEMPLATES_DIR,
     'reset-password-email.html',
   );
  const templateSource = await readFile(resetTemplatePath, 'utf-8');
   const template = Handlebars.compile(templateSource);

   const html = template({
     name: user.name,
     link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
   });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error)  {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

