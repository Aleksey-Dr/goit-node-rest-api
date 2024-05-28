import fs from 'fs/promises';
import path from 'path';

import { nanoid } from 'nanoid';

const contactsPath = path.resolve('db', 'contacts.json');
const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));

export async function listContacts() {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
};

export async function getContactById(contactId) {
    const contacts = await listContacts();
    const result = contacts.find(contact => contact.id === contactId);
    return result || null;
};

export async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return result;
};

export async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
};

export async function updateContact(contactId, name, email, phone) {
    const contacts = await listContacts();
    const [contact] = contacts.filter(itemContacts => itemContacts.id === contactId);
    if (contact === '') {
        return null;
    }
    if (name) {
        contact.name = name;
    }
    if (email) {
        contact.email = email;
    }
    if (phone) {
        contact.phone = phone;
    }
    await updateContacts(contacts);
    return contact;
};