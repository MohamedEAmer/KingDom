import mongoose from 'mongoose';

const EventsDetailSchema = new mongoose.Schema({
  img: { type: String, },
  text: { type: String, },
}, { _id: true });

const EventsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  info: {
    details: { type: [EventsDetailSchema], default: [] }
  }
});

const EventsModal = mongoose.models.Event || mongoose.model('Events', EventsSchema);
export default EventsModal;
