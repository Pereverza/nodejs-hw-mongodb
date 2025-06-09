import * as fs from 'node:fs/promises';
import { PATH_DB_CONTACTS } from '../constants/contacts.js';

export const writeContacts = (contacts) =>
  fs.writeFile(PATH_DB_CONTACTS, JSON.stringify(contacts, null, 2));
