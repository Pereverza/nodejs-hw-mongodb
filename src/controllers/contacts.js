import { getContact, getContactById } from '../services/contact.js';
import createHttpError from 'http-errors';

export const getContactController = async (req, res) => {
  const data = await getContact();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await getContactById(id);

  if (!data) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: `Successfull found contact with id=${id}`,
    data,
  });
};
