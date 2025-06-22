import ContactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { sortList } from '../constants/index.js';

export const getContact = async ({
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder = sortList[0],
}) => {
  const skip = (page - 1) * perPage;
  const contacts = await ContactCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await ContactCollection.countDocuments();

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    contacts,
    totalItems,
    ...paginationData,
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContactsById = async (id, payload, options = {}) => {
  const result = await ContactCollection.findByIdAndUpdate(id, payload, {
    includeResultMetadata: true,
    ...options,
  });
  if (!result || !result.value) return null;

  const isNew = Boolean(result?.lastErrorObject?.upserted);

  return {
    isNew,
    data: result?.value,
  };
};

export const deleteContactById = (id) =>
  ContactCollection.findByIdAndDelete(id);
