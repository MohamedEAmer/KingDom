import express from 'express';
import { getRates,setRates} from '../controllers/RatesController.js';
import authMiddleware from "../middleware/authMiddleware.js";


const RatesRouter = express.Router();

RatesRouter.get('/', getRates);   
RatesRouter.post('/', authMiddleware , setRates);             


export default RatesRouter;
