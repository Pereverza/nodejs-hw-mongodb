import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.data,
    });
    return;
  }

  const status = err.status || 500;

  res.status(status).json({
    status,
    message: err.message || 'Something went wrong',
    data: err.data,
  });
};

