import mongoose from "mongoose";

const RatesSchema = new mongoose.Schema({
  expRate: { type: Number, default: 1 },
  dropRate: { type: Number, default: 1 },
  goldRate: { type: Number, default: 1 },

});
const RatesModal = mongoose.models.Rate || mongoose.model('Rates', RatesSchema);

export default RatesModal;
