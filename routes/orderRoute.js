const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const InventoryItem = require('../models/InventoryItem');
const Table = require('../models/Table');
const requireAdmin = require('../middleware/authMiddleware');


// ROUTE 1: POST /orders
// Purpose: place a new order — calculates total price,
// checks and deducts inventory automatically

router.post('/orders', async (req, res) => {
  const { tableId, items } = req.body;
  // items is expected like: [{ menuItemId: "...", quantity: 2 }, ...]

  if (!tableId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Table and at least one item are required' });
  }

  try {
    // Step 1: make sure the table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    let totalPrice = 0;
    // This will collect every ingredient deduction needed, across ALL ordered items,
    // before we actually touch the database — so we can check availability first
    const inventoryUpdates = [];

    // Step 2: go through each ordered item one by one
    for (const orderedItem of items) {
      const menuItem = await MenuItem.findById(orderedItem.menuItemId);

      if (!menuItem) {
        return res.status(404).json({ error: `Menu item not found: ${orderedItem.menuItemId}` });
      }

      // Add this item's cost to the running total
      totalPrice += menuItem.price * orderedItem.quantity;

      // Step 3: for each ingredient this menu item uses, calculate how much
      // is needed in total (ingredient's usage per dish × how many dishes ordered)
      for (const ingredient of menuItem.ingredients) {
        const inventoryItem = await InventoryItem.findById(ingredient.inventoryItemId);

        if (!inventoryItem) {
          return res.status(404).json({ error: 'A required inventory item no longer exists' });
        }

        const amountNeeded = ingredient.quantityUsed * orderedItem.quantity;

        // Step 4: check if there's enough stock
        if (inventoryItem.quantity < amountNeeded) {
          return res.status(400).json({
            error: `Not enough ${inventoryItem.item} in stock. Needed: ${amountNeeded}, available: ${inventoryItem.quantity}`,
          });
        }

        // If enough stock exists, remember this deduction for later —
        // we don't apply it yet, in case a LATER item in the loop fails
        inventoryUpdates.push({ inventoryItem, amountNeeded });
      }
    }

    // Step 5: everything checked out — now actually apply all inventory deductions
    for (const update of inventoryUpdates) {
      update.inventoryItem.quantity -= update.amountNeeded;
      await update.inventoryItem.save();
    }

    // Step 6: create the order itself
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
    // .populate('items.menuItemId') reaches INTO the items array and replaces
    // each menuItemId reference with the full MenuItem document

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