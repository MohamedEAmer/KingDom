import mongoose from "mongoose";

const WarSchema = new mongoose.Schema({
  day: { type: String, required: true },
  wars: [
    {
      time: { type: String, required: true },
      duration: { type: Number, default: 35 }, 
      isNext: { type: Boolean, default: false } 
    }
  ]
});

const WarModal = mongoose.models.War || mongoose.model('War', WarSchema);

export default WarModal;
