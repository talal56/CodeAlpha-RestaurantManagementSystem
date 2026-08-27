const express = require('express')
const router = express.Router()
const InventoryItem = require('../models/InventoryItem')
const requireAdmin = require('../middleware/authMiddleware');

router.get('/inventoryItem', async (req, res) => {
    try {
        const item = await InventoryItem.find({})
        res.json(item)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})


router.post('/inventoryItem',requireAdmin ,async (req, res) => {
    const { item, quantity, unit, lowStockThreshold } = req.body
    if (!item || !quantity || !unit) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    try {
        const newItem = new InventoryItem({ item, quantity, unit, lowStockThreshold })
        await newItem.save()
        res.status(201).json(newItem)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})


router.get('/inventoryItem/:id', async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id)
        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' })
        }
        res.json(item)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})


router.put('/inventoryItem/:id',requireAdmin, async (req, res) => {
    try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!updatedItem) {
            return res.status(404).json({ error: 'Inventory item not found' })
        }
        res.json(updatedItem)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})


router.delete('/inventoryItem/:id',requireAdmin, async (req, res) => {
    try {
        const deleted = await InventoryItem.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ error: 'Inventory item not found' })
        }
        res.json({ message: 'Inventory item deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})

module.exports = router