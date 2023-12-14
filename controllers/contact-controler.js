import contactsService from "../models/contacts/index.js";
import {HttpError} from "../helpers/index.js"

const getAll = async (req, res, next) => {
    try {
        const result = await contactsService.listContacts();
      
        res.json(result);        
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.getContactById(contactId);
        if (!result) {
            throw HttpError(404, `Contact with id=${contactId} not found`)
            // const error = new Error(`Contact with id=${contactId} not found`);
            // error.status = 404;
            // throw error;
            // return res.status(404).json({
            //     message: `Contact with id=${contactId} not found`
            // })
        }

        res.json(result);
    }
    catch (error) {
        const { status = 500, message = "Server error" } = error;
        res.status(status).json({
            message,
        })
    }
}

export default {
    getAll,    
    getById,
}