import Contact from '../models/Contact.js';

export function listContacts(search = {}) {
    const { filter = {}, fields = '', settings = {} } = search;
    return Contact.find(filter, fields, settings).populate('owner', '-_id username email');
};

export function countContacts(filter) {
    return Contact.countDocuments(filter);
};

export function getContact(filter) {
    return Contact.findOne(filter);
};

export function removeContact(filter) {
    return Contact.findOneAndDelete(filter);
};

export function addContact(data) {
    return Contact.create(data);
};

export function updateContact(filter, data) {
    return Contact.findOneAndUpdate(filter, data);
};

export function updateStatusContact(filter, data) {
    return Contact.findByIdAndUpdate(filter, data, {new: true});
};