require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const inventoryItemRoute = require('./routes/inventoryItemRoute')
const menuRoute = require('./routes/menuRoute')
const orderRoute = require('./routes/orderRoute')
const reservationRoute = require('./routes/reservationRoute')
const tableRoute = require('./routes/tableRoute')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))  // confirm your real folder name here

app.use('/api', inventoryItemRoute)
app.use('/api', menuRoute)
app.use('/api', orderRoute)
app.use('/api', reservationRoute)
app.use('/api', tableRoute)

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to mongoose')
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    })
}).catch((err) => {
    console.log('Mongo DB connection error :', err)
})