import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js"

const getAll = async (req, res) => {  
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
        const result = await Contact.find({owner}, "-favorite", {skip, limit}).populate("owner", "owner");
      
        res.json(result);    
}

const getById = async (req, res) => {    
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id, owner });        
        if (!result) {
            throw HttpError(404, `Contact with id ${contactId} not found`)            
        }

        res.json(result);    
}

const add = async (req, res) => {
        const { _id: owner } = req.user;
        const result = await Contact.create({...req.body, owner});

        res.status(201).json(result);   
}

const updateById = async (req, res) => {      
        const { contactId: _id } = req.params;
        const { _id: owner } = req.user;
        const result = await Contact.findOneAndUpdate({_id, owner}, req.body);
        if (!result) {
            throw HttpError(404, `Contact with id ${contactId} not found`)           
        }

        res.json(result);    
}


const updateStatusContact = async (req, res) => {      
        const { contactId: _id } = req.params;
        const { _id: owner } = req.user;
        const result = await Contact.findOneAndUpdate({_id, owner}, req.body);
        if (!result) {
            throw HttpError(404, `Contact with id ${contactId} not found`)           
        }

        res.json(result);    
}

const deleteById = async (req, res) => {   
        const { contactId: _id } = req.params;
        const { _id: owner } = req.user;
        const result = await Contact.findOneAndDelete({_id, owner});
        if (!result) {
            throw HttpError(404, `Contact with id ${contactId} not found`)           
        }

        res.status(200).json({
            message: "contact deleted" 
        })   
}

export default {
    getAll: ctrlWrapper(getAll),    
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteById: ctrlWrapper(deleteById)
}