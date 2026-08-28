// routes/AuthRouter.js
import express from 'express';
import { loginUser, registerUser,changePlayerPassword ,activateAccount, getUserData, IsAdmin} from '../controllers/AuthController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const AuthRouter = express.Router();

AuthRouter.post('/login', loginUser);        // FIXED: should be POST for login
AuthRouter.post('/register', registerUser);  // Register new user
AuthRouter.put('/changePassword', authMiddleware ,changePlayerPassword)
AuthRouter.get("/activate/:token", activateAccount);// For activation
AuthRouter.get("/user", authMiddleware ,getUserData);// For User Data
AuthRouter.get("/type", authMiddleware ,IsAdmin);// For Admin Validation




export default AuthRouter;
