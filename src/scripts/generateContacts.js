import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";
const generateContacts = async (number) => {

    const contact = Array(number).fill(0).map(createFakeContact);
    const prevContacts = await readContacts();

    await writeContacts([...prevContacts, ...contact]);

};

generateContacts(5);
