import mongoose from 'mongoose';

const PurchaseItemSchema = new mongoose.Schema({
  itemId: {
    type: Number,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  receiverId: {
    type: Number,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

const PurchasesSchema = new mongoose.Schema({
  AccountId: {
    type: Number,
    required: true,
    index: true,
  },
  Name: {
    type: String,
    required: true,
  },
  purchases: {
    type: [PurchaseItemSchema],
    default: [],
  },
});

const PurchasesModal = mongoose.models.Purchase || mongoose.model('Purchases', PurchasesSchema);
export default PurchasesModal;