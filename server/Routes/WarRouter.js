import express from 'express';
import { getTownOccupation ,getWarsTiming, setWarsTiming ,getTownLastWarResult,getTownWarLeaderboard ,getTownAllWars} from '../controllers/WarController.js';
import authMiddleware from "../middleware/authMiddleware.js";


const WarRouter = express.Router();

WarRouter.get('/occupation', getTownOccupation);
WarRouter.get('/timings', getWarsTiming);   
WarRouter.post('/timings', authMiddleware, setWarsTiming);
WarRouter.get('/one/:Town', authMiddleware, getTownLastWarResult);        
WarRouter.get('/town/all/:Town', authMiddleware, getTownWarLeaderboard);// not used yet ...!      
WarRouter.get('/all/:Town', authMiddleware, getTownAllWars);      



export default WarRouter;
