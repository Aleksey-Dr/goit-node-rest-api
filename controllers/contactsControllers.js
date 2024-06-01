import * as contactsService from "../services/contactsServices.js";
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from "../decorators/controllerWrapper.js";

const getAllContacts = async (_, res) => {
    const result = await contactsService.listContacts();
    res.json(result);
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
};

const deleteContact =  async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({
        message: "Contact deleted",
    });
};

const createContact = async (req, res) => {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
};

const toggleFavorite = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.updateStatusContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    toggleFavorite: ctrlWrapper(toggleFavorite),
};