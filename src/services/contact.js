import ContactCollection from "../db/models/Contact.js";

export const getContact = () => ContactCollection.find();

export const getContactId = id => ContactCollection.findById(id);
