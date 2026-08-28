import express from 'express';
import { getTop10Ranks ,getTotalPlayers,getPlayer ,editPlayerBalance ,getPlayerBalance,getPlayerItems,getAllPlayersCharactersInfo,getVipInfo,getKing,getRoyalRoleList} from '../controllers/PlayersController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const PlayersRouter = express.Router();

PlayersRouter.get('/ranks', getTop10Ranks);  
PlayersRouter.get('/king', getKing);
PlayersRouter.get('/royals/:level', getRoyalRoleList);  
PlayersRouter.get('/all', getTotalPlayers);
PlayersRouter.get('/players', authMiddleware, getAllPlayersCharactersInfo);
PlayersRouter.get('/vip', authMiddleware, getVipInfo);           
PlayersRouter.get('/', authMiddleware, getPlayer);
PlayersRouter.get('/points/:id', getPlayerBalance);
PlayersRouter.get('/items', authMiddleware, getPlayerItems);                       
PlayersRouter.put('/balance/:id', authMiddleware, editPlayerBalance);                       


export default PlayersRouter;
