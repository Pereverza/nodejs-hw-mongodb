import ContactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContact = async ({
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder = 'asc',
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const query = ContactCollection.find();

  if (filters.userId) {
    query.where('userId').equals(filters.userId);
  }

  if (filters.isFavourite !== undefined) {
    query.where('isFavourite').equals(filters.isFavourite);
  }

  if (filters.contactType) {
    query.where('contactType').equals(filters.contactType);
  }

  const [totalItems, data] = await Promise.all([
    ContactCollection.find().merge(query).countDocuments(),
    query
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData({ page, perPage, totalItems });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};


export const getContactById = (query) => ContactCollection.findOne(query);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContacts = async (query,  payload, options = {}) => {
  const result = await ContactCollection.findOneAndUpdate(query, payload, {
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

export const deleteContact = query =>
  ContactCollection.findOneAndDelete(query);
