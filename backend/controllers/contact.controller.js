import {Contact} from '../models/contact.model.js'

export const saveContactUs = async(req,res) => {
    const {name,email,message} = req.body;
    try {
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
    const newContact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, message: "message sent sucess" });

    }
    catch(error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error:'Error sending message' });
    }   
}