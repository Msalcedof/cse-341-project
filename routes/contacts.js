const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get('/', async (req, res) => {
  try {
    const contacts = await req.db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /contacts/search:
 *   get:
 *     summary: Get contact by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact found
 *       400:
 *         description: Missing ID
 *       404:
 *         description: Contact not found
 */
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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created
 *       400:
 *         description: Missing required fields
 */
router.post('/', async (req, res) => {
  try {
    const newContact = req.body;

    const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
    for (const field of requiredFields) {
      if (!newContact[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    const result = await req.db.collection('contacts').insertOne(newContact);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const contactId = req.params.id;
    const updatedContact = req.body;

    const result = await req.db.collection('contacts').updateOne(
      { _id: new ObjectId(contactId) },
      { $set: updatedContact }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const contactId = req.params.id;

    const result = await req.db.collection('contacts').deleteOne({ _id: new ObjectId(contactId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
