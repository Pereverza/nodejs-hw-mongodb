import ContactCollection from '../db/models/Contact.js';

export const getContact = () => ContactCollection.find();

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContactsById = async (id, payload, options = {}) => {
  const result = await ContactCollection.findByIdAndUpdate(id, payload, {
    new: true,
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
