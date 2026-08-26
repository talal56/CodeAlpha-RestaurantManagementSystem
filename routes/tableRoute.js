const express = require('express');
const router = express.Router();
const Table = require('../models/Table')

// ============================================
// ROUTE 1: GET /table
// Purpose: list all tables
// ============================================
router.get('/table', async (req, res) => {
    try {
        const tables = await Table.find({});
        res.json(tables);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

// ============================================
// ROUTE 2: POST /table
// Purpose: create a new table
// ============================================
router.post('/table', async (req, res) => {
    const { tableNo, capacity, status } = req.body;
    if (!tableNo || !capacity) {
        return res.status(400).json({ error: 'Table number and capacity are required' });
    }

    try {
        const newTable = new Table({ tableNo, capacity, status })
        await newTable.save();
        res.status(201).json(newTable)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error, please try again' })
    }
})

// ============================================
// ROUTE 3: GET /table/:id
// Purpose: get one specific table by its ID
// ============================================
router.get('/table/:id', async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        res.json(table);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

// ============================================
// ROUTE 4: PUT /table/:id
// Purpose: update a table (e.g. change its status to "Occupied")
// ============================================
router.put('/table/:id', async (req, res) => {
    try {
        const updatedTable = await Table.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTable) {
            return res.status(404).json({ error: 'Table not found' });
        }

        res.json(updatedTable);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

// ============================================
// ROUTE 5: DELETE /table/:id
// Purpose: remove a table
// ============================================
router.delete('/table/:id', async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id)
        if (!table) {
            return res.status(404).json({ error: 'Table not found' })
        }
        res.json({ message: 'Table deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router