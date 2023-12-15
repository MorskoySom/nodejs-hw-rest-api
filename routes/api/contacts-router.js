import express from "express";

import contactControler from "../../controllers/contact-controler.js";

// import contactsService from "../../models/contacts/index.js";

const contactsRouter = express.Router()

contactsRouter.get('/', contactControler.getAll)

contactsRouter.get('/:contactId', contactControler.getById)

contactsRouter.post('/', contactControler.add)

contactsRouter.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

export default contactsRouter;