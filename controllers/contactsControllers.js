import * as contactsService from "../services/contactsServices.js";
import HttpError from '../helpers/HttpError.js';

import { createContactSchema } from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res, next) => {
    try {
        const result = await contactsService.listContacts();
        res.json(result);
    }
    catch(error) {
        next(error);
    };
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await contactsService.getContactById(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    }
    catch(error) {
        next(error);
    };
};

export const deleteContact =  async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await contactsService.removeContact(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json({
            message: "Contact deleted",
        });
    }
    catch(error) {
        next(error);
    };
};

export const createContact = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const result = await contactsService.addContact(name, email, phone);
        res.status(201).json(result);
    }
    catch(error) {
        next(error);
    };
};

export const updateContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const { name, email, phone } = req.body;
        const result = await contactsService.updateContact(id, name, email, phone);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    }
    catch(error)
    {
        next(error); 
    };
};