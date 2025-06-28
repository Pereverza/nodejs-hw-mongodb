import { registerUser, loginUser } from "../services/auth.js";

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

  res.cookie('session', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });;

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken,
    },
  });
}
