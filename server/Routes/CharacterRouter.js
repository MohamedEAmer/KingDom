import express from 'express';
import { getDailyAttend ,getDailyData,getCharMail,giveCharBeta,getGachaUsed,giveGachaGift} from '../controllers/CharacterController.js';
import authMiddleware from "../middleware/authMiddleware.js";



const CharacterRouter = express.Router();
CharacterRouter.get('/day/data', getDailyData);  
CharacterRouter.get('/daily/:name/:id', getDailyAttend);
CharacterRouter.get('/mail/:id', authMiddleware, getCharMail);
CharacterRouter.post('/beta/:id', authMiddleware, giveCharBeta);
CharacterRouter.get('/gacha/:id', getGachaUsed);
CharacterRouter.post('/gacha/:id/:gacha', authMiddleware, giveGachaGift);



                     
export default CharacterRouter;
