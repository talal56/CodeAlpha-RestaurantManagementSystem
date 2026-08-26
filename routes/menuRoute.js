const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');


router.post('/menu', async (req, res) => {
  const { name, category, price, ingredients } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  try {
    const newItem = new MenuItem({ name, category, price, ingredients });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});


router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find({});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/menu/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,       // whatever fields the frontend sends get updated
      { new: true }   // return the UPDATED document, not the old one
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/menu/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;