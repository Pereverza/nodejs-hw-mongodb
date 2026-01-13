import {
  getContact,
  getContactById,
  addContact,
  updateContacts,
  deleteContact,
} from '../services/contact.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginstionParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSortFields } from '../db/models/Contact.js';
import { parseContactFilters } from '../utils/filters/parseContactFilters.js';
import { saveFileToUploadDir } from '../utils/severFileToUploadsDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

const enableCloudinary = getEnvVar('ENABLE_CLOUDINARY') === 'true';

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
  const { _id: userId } = req.user;
  const data = await getContactById({ _id: id, userId });

  if (!data) return next(createHttpError(404, 'Contact not found'));

  res.json({
    status: 200,
    message: `Successfully found contact with id=${id}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  let photo = null;

  if (req.file) {
    photo = enableCloudinary
      ? await saveFileToCloudinary(req.file)
      : await saveFileToUploadDir(req.file, userId);
  }

  const contactData = { ...req.body, photo, userId };
  const result = await addContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const upsertContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await updateContacts({ _id: id, userId }, req.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const patchContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  let photoUrl;

  if (req.file) {
    photoUrl = enableCloudinary
      ? await saveFileToCloudinary(req.file)
      : await saveFileToUploadDir(req.file, userId);
  }

  const result = await updateContacts(
    { _id: id, userId },
    { ...req.body, ...(photoUrl ? { photo: photoUrl } : {}) },
  );

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
  const { _id: userId } = req.user;
  const data = await deleteContact({ _id: id, userId });

  if (!data) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Contact deleted successfully!',
  });
};
