import express from "express";

import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from '../middlewares/isValidId.js';
import validateBody from "../helpers/validateBody.js";
import contactsControllers from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  toggleFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:id", isValidId, isEmptyBody, validateBody(updateContactSchema), contactsControllers.updateContact);

contactsRouter.patch('/:id/favorite', isValidId, validateBody(toggleFavoriteSchema), contactsControllers.toggleFavorite);

export default contactsRouter;