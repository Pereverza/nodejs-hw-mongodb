import {
  getContact,
  getContactById,
  addContact,
  updateContactsById,
  deleteContactById,
} from '../services/contact.js';
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
export const addContactController = async (req, res) => {
  const result = await addContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const upsertContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { isNew, data } = await updateContactsById(id, req.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};
export const patchContactByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await updateContactsById(id, req.body);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};
export const deleteContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await deleteContactById(id);
  if (!data) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
  // res.json({
  //   status: 204,
  //   message: "Successfully delete a contact",
  //   data,
  // });
};
