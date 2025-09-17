const express = require('express');
const router = express.Router();

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await req.db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one contact by ID
router.get('/search', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const contactId = req.query.id;

    if (!contactId) {
      return res.status(400).json({ message: 'Missing id query parameter' });
    }

    const contact = await req.db.collection('contacts').findOne({ _id: new ObjectId(contactId) });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
