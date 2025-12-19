import path from 'path';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import EventsModal from '../models/EventsModal.js';
import { fileURLToPath } from 'url';

// Needed for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await EventsModal.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get events.', error: err.message });
  }
};

// 2. Get one event by ID
export const getOneEvent = async (req, res) => {
  try {
    const event = await EventsModal.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get event.', error: err.message });
  }
};

// Create Event Controller
export const createEvent = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      if (!name || !description || !req.files || !req.files.mainImage || !req.files.detailImages) {
        return res.status(400).json({ message: 'Missing required fields or files.' });
      }
  
      const mainImageFile = req.files.mainImage;
      const detailImages = req.files.detailImages;
  
      // Handle main image
      const mainExt = path.extname(mainImageFile.name);
      const mainImageName = `main_${uuid()}${mainExt}`;
      const mainImagePath = path.join(__dirname, '..', 'uploads', mainImageName);
  
      await mainImageFile.mv(mainImagePath);
  
      // Parse the detailsText (JSON array of strings)
      let detailsText;
      try {
        detailsText = JSON.parse(req.body.detailsText || '[]');
      } catch (err) {
        return res.status(400).json({ message: 'detailsText must be valid JSON array.' });
      }
  
      if (!Array.isArray(detailsText) || detailsText.length === 0) {
        return res.status(400).json({ message: 'detailsText should be a non-empty array.' });
      }
  
      // Normalize to array if single file
      const detailImageFiles = Array.isArray(detailImages) ? detailImages : [detailImages];
  
      // Save each detail image
      const length = Math.max(detailImageFiles.length, detailsText.length);
      const details = [];
      
      for (let i = 0; i < length; i++) {
        const img = detailImageFiles[i];
        const text = detailsText[i];
      
        let fileName = '';
      
        if (img) {
          const ext = path.extname(img.name);
          fileName = `detail_${uuid()}${ext}`;
          const filePath = path.join(__dirname, '..', 'uploads', fileName);
          await img.mv(filePath);
        }
      
        // Skip if both image and text are missing
        if (!img && !text) continue;
      
        details.push({
          img: fileName,       // '' if no image
          text: text || ''     // '' if no text
        });
      }

      // Save event to DB
      const newEvent = await EventsModal.create({
        name,
        image: mainImageName,
        description,
        info: { details }
      });
  
      res.status(201).json({ message: 'Event created successfully.', event: newEvent });
  
    } catch (err) {
      console.error('Error creating event:', err);
      res.status(500).json({ message: 'Server error while creating event.' });
    }
};


// 4. Delete event by ID
export const deleteEvent = async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await EventsModal.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
  
      // Delete main image
      const mainImagePath = path.join(__dirname, '..', 'uploads', event.image);
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
      }
  
      // Delete all detail images
      event.info.details.forEach(detail => {
        if (detail.img) {
          const detailImagePath = path.join(__dirname, '..', 'uploads', detail.img);
          if (fs.existsSync(detailImagePath)) {
            fs.unlinkSync(detailImagePath);
          }
        }
      });
  
      // Remove from DB
      await EventsModal.findByIdAndDelete(eventId);
  
      res.status(200).json({ message: 'Event and associated images deleted successfully.' });
    } catch (err) {
      console.error('Error deleting event:', err);
      res.status(500).json({ message: 'Server error while deleting event.' });
    }
};

// 5. Get one event detail (by event ID and detail ID)
export const getEventDetail = async (req, res) => {
  const { id, detailId } = req.params;
  try {
    const event = await EventsModal.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const detail = event.info.details.id(detailId);
    if (!detail) return res.status(404).json({ message: 'Detail not found' });

    res.status(200).json(detail);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get detail.', error: err.message });
  }
};

// 6. Delete one event detail (by event ID and detail ID)
export const deleteEventDetail = async (req, res) => {
    try {
      const { id, detailId } = req.params;
  
      const event = await EventsModal.findById(id);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
  
      // Find the detail
      const detailToDelete = event.info.details.find(d => d._id.toString() === detailId);
      if (!detailToDelete) {
        return res.status(404).json({ message: 'Detail not found.' });
      }
  
      // Delete image file
      if (detailToDelete.img) {
        const detailImagePath = path.join(__dirname, '..', 'uploads', detailToDelete.img);
        if (fs.existsSync(detailImagePath)) {
          fs.unlinkSync(detailImagePath);
        }
      }
  
      // Remove detail from event
      event.info.details = event.info.details.filter(d => d._id.toString() !== detailId);
      await event.save();
  
      res.status(200).json({ message: 'Detail deleted successfully.' });
    } catch (err) {
      console.error('Error deleting event detail:', err);
      res.status(500).json({ message: 'Server error while deleting detail.' });
    }
};