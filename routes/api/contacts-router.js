import express from "express";

import contactControler from "../../controllers/contact-controler.js";

import { authenticate, isNoBody, isCorrectId, isNoBodyFavorite, upload } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/Contact.js";

const contactsRouter = express.Router()

contactsRouter.use(authenticate);

contactsRouter.get('/', contactControler.getAll)

contactsRouter.get('/:contactId', isCorrectId, contactControler.getById)

contactsRouter.post('/', isNoBody, validateBody(contactAddSchema), contactControler.add)

// contactsRouter.post('/', upload.single("avatar"), isNoBody, validateBody(contactAddSchema), contactControler.add)

contactsRouter.put('/:contactId', isNoBody, isCorrectId, validateBody(contactUpdateSchema), contactControler.updateById)

contactsRouter.patch('/:contactId/favorite', isNoBodyFavorite, isCorrectId, validateBody(contactUpdateFavoriteSchema), contactControler.updateStatusContact)

contactsRouter.delete('/:contactId', isCorrectId, contactControler.deleteById)


export default contactsRouter;



