// routes/AuthRouter.js
import express from 'express';
import { loginUser, registerUser,changePlayerPassword ,activateAccount} from '../controllers/AuthController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const AuthRouter = express.Router();

AuthRouter.post('/login', loginUser);        // FIXED: should be POST for login
AuthRouter.post('/register', registerUser);  // Register new user
AuthRouter.put('/changePassword/:id', authMiddleware ,changePlayerPassword)
AuthRouter.get("/activate/:token", activateAccount);// For activation


export default AuthRouter;
