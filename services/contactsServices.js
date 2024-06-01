import Contact from '../models/Contact.js';

export async function listContacts(search = {}) {
    const { filter = {}, fields } = search;
    return Contact.find(filter, fields);
};

export async function getContactById(_id) {
    const result = await Contact.findById({_id});
    return result;
};

export async function removeContact(id) {
    return Contact.findByIdAndDelete(id);
};

export async function addContact(data) {
    return Contact.create(data);
};

export async function updateContact(id, data) {
    return Contact.findByIdAndUpdate(id, data);
};

export async function updateStatusContact(id, data) {
    return Contact.findByIdAndUpdate(id, data, {new: true});
};