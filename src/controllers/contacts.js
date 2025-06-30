import {
  getContact,
  getContactById,
  addContact,
  updateContactsById,
  deleteContactById,
} from '../services/contact.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginstionParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSortFields } from '../db/models/Contact.js';
import { parseContactFilters } from '../utils/filters/parseContactFilters.js';

export const getContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, contactSortFields);
  const filters = parseContactFilters(req.query);
  filters.userId = userId;
  const result = await getContact({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,

  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await getContactById(id);

  if (!data) return next(createHttpError(404, 'Contact not found'));

  res.json({
    status: 200,
    message: `Successfull found contact with id=${id}`,
    data: data,
  });
};
export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const result = await addContact({ ...req.body, userId });
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
    data: data,
  });
};
export const patchContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const result = await updateContactsById(id, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data ?? result,
  });
};
export const deleteContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await deleteContactById(id);
  if (!data) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
