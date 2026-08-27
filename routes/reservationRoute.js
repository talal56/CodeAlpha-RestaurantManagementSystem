const express = require('express')
const router = express.Router()
const Reservation = require('../models/Reservation')
const Table = require('../models/Table')
const requireAdmin = require('../middleware/authMiddleware');


router.get('/reservation', async (req, res) => {
    try {
        const reservations = await Reservation.find({})
        res.json(reservations)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})

router.post('/reservation', async (req, res) => {
    const { tableId, customerName, dateTime, partySize } = req.body;

    if (!tableId || !customerName || !dateTime || !partySize) {
        return res.status(400).json({ error: 'Table, customer name, date/time, and party size are required' })
    }

    try {
        
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        
        if (partySize > table.capacity) {
            return res.status(400).json({ error: `This table only seats ${table.capacity} people` });
        }

       
        const conflict = await Reservation.findOne({ tableId, dateTime });
        if (conflict) {
            return res.status(400).json({ error: 'This table is already reserved at that time' });
        }

        
        const newReservation = new Reservation({ tableId, customerName, dateTime, partySize })
        await newReservation.save()
        res.status(201).json(newReservation)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})

router.put('/reservation/:id', async (req, res) => {
    try {
        const updation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updation) {
            return res.status(404).json({ error: 'Reservation not found' })
        }
        res.json(updation)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})

router.delete('/reservation/:id', async (req, res) => {
    try {
        const deleted = await Reservation.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Reservation not found' })
        }
        res.json({ message: 'Reservation deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'System error, please try again' })
    }
})

module.exports = router