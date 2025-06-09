import * as fs from "node:fs/promises";
import { PATH_DB_CONTACTS } from "../constants/contacts.js";


export const readContacts = async () =>
  JSON.parse(await fs.readFile(PATH_DB_CONTACTS, 'utf-8'));
