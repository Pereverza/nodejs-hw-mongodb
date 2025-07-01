import { registerUser, loginUser, refreshUser, logoutUser } from "../services/auth.js";

const setupSession = (res, { _id, refreshToken, refreshTokenValidUntil }) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('session', _id.toString(), {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};
export const registerController = async (req, res) => {
   await registerUser(req.body);

    res.json({
      message: 'Successfully registered a user!'
    });
};
export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
export const logoutController = async (req, res) => {

  if (req.cookies.session) {
    await logoutUser(req.cookies.session);
  }
  res.clearCookie('session');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
export const refreshController = async (req, res) => {
  const session = await refreshUser(req.cookies);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
