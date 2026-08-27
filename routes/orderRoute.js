const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const InventoryItem = require('../models/InventoryItem');
const Table = require('../models/Table');
const requireAdmin = require('../middleware/authMiddleware');




router.post('/orders', async (req, res) => {
  const { tableId, items } = req.body;
  

  if (!tableId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Table and at least one item are required' });
  }

  try {
    
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    let totalPrice = 0;
   
    const inventoryUpdates = [];

    
    for (const orderedItem of items) {
      const menuItem = await MenuItem.findById(orderedItem.menuItemId);

      if (!menuItem) {
        return res.status(404).json({ error: `Menu item not found: ${orderedItem.menuItemId}` });
      }

      
      totalPrice += menuItem.price * orderedItem.quantity;

      
      for (const ingredient of menuItem.ingredients) {
        const inventoryItem = await InventoryItem.findById(ingredient.inventoryItemId);

        if (!inventoryItem) {
          return res.status(404).json({ error: 'A required inventory item no longer exists' });
        }

        const amountNeeded = ingredient.quantityUsed * orderedItem.quantity;

      
        if (inventoryItem.quantity < amountNeeded) {
          return res.status(400).json({
            error: `Not enough ${inventoryItem.item} in stock. Needed: ${amountNeeded}, available: ${inventoryItem.quantity}`,
          });
        }

       
        inventoryUpdates.push({ inventoryItem, amountNeeded });
      }
    }

    
    for (const update of inventoryUpdates) {
      update.inventoryItem.quantity -= update.amountNeeded;
      await update.inventoryItem.save();
    }

    
    const newOrder = new Order({
      tableId,
      items,
      totalPrice,
    });
    await newOrder.save();

    res.status(201).json(newOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});


// ROUTE 2: GET /orders
// Purpose: list all orders

router.get('/orders',requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ROUTE 3: GET /orders/:id
// Purpose: get one specific order, with full menu item details attached

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItemId');
   
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ROUTE 4: PUT /orders/:id
// Purpose: update an order's status (Pending -> Preparing -> Served -> Paid)

router.put('/orders/:id',requireAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;