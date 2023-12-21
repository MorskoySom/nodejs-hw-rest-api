import express from "express";

import contactControler from "../../controllers/contact-controler.js";

import {isNoBody} from "../../middlewares/index.js"

const contactsRouter = express.Router()

contactsRouter.get('/', contactControler.getAll)

// contactsRouter.get('/:contactId', contactControler.getById)

contactsRouter.post('/', isNoBody, contactControler.add)

// contactsRouter.put('/:contactId', isNoBody, contactControler.updateById)

// contactsRouter.delete('/:contactId', contactControler.deleteById)


export default contactsRouter;