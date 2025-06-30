import { registerUser, loginUser, logoutUser } from "../services/auth.js";

export const registerController = async (req, res) => {
   await registerUser(req.body);

    res.json({
      message: 'Successfully registered a user!'
    });
};
export const loginController = async (req, res) => {
  const { _id, accessToken, refreshToken, refreshTokenValidUntil } = await loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('session', _id.toString(), {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });;

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
}
export const logoutUserController = async (req, res) => {
  const sessionId = req.cookies.session;

  if (sessionId) {
    await logoutUser(sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send(); 
};