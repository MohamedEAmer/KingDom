import express from 'express';
import {
  getCategoryItems,
  getItem,
  editItem,
  deleteItem,
  addItem,
  buyItem,
  getAllItems
} from '../controllers/ItemsShopController.js';
import authMiddleware from "../middleware/authMiddleware.js";


const ItemsShopRouter = express.Router();
ItemsShopRouter.get('/items',getAllItems)
// Get items by category
ItemsShopRouter.get('/category', getCategoryItems);
// Get a single item by ID
ItemsShopRouter.get('/:guid', getItem);
// Add a new item
ItemsShopRouter.post('/', authMiddleware, addItem);
// Edit an existing item
ItemsShopRouter.put('/:guid', authMiddleware, editItem);
// buy an Item
ItemsShopRouter.post('/buy/:receiverName/:guid', authMiddleware ,buyItem)
// Delete an item
ItemsShopRouter.delete('/:guid', authMiddleware , deleteItem);

export default ItemsShopRouter;
