import express from 'express';
import {
  getEvents,
  getOneEvent,
  createEvent,
  deleteEvent,
  getEventDetail,
  deleteEventDetail
} from '../controllers/EventsController.js';
import authMiddleware from "../middleware/authMiddleware.js";


const EventsRouter = express.Router();

EventsRouter.get('/', getEvents);                          // GET all events
EventsRouter.get('/:id', getOneEvent);                     // GET one event by ID
EventsRouter.post('/create', authMiddleware, createEvent);                       // POST create new event
EventsRouter.delete('/:id', authMiddleware, deleteEvent);                  // DELETE event by ID
EventsRouter.get('/:id/detail/:detailId', getEventDetail); // GET one detail by detail ID
EventsRouter.delete('/:id/detail/:detailId', authMiddleware, deleteEventDetail); // DELETE one detail

export default EventsRouter;
