import { readContacts } from "../utils/readContacts.js";

const getAllContacts = () => readContacts();

console.log(await getAllContacts());
