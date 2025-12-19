import sqlPool from '../db/sqlConnection.js';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { sendActivationEmail } from "../middleware/emailMiddleware.js";

import { HttpError } from '../Models/errorModel.js';


export const loginUser = async (req, res , next) => {
  const { username, password } = req.body;
  try {
    const [sqlResult] = await sqlPool.query(
      'SELECT * FROM account WHERE Name = ? AND BINARY Password = ?',
      [username, password]
    );
    if (!sqlResult||sqlResult.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    console.log(sqlResult[0].IsActive)
    if(sqlResult[0].IsActive !== 1){
      return res.status(401).json({ message: ' BANNED OR Not ACTIVATED Yet Please Check Your E-Mail' });
    }

    const user = sqlResult[0];
    const { AccountId, Name, EmailAddress, RoleGroupName, IsActive ,IsBeta ,Points ,VipLevel ,UsedPoints} = user;

    const [nextVipTarget] = await sqlPool.query(
      'SELECT TargetPoints FROM viplevels WHERE VipLevel = ?',
      [VipLevel < 20 ? (VipLevel + 1) : VipLevel]
    );

    const token = jwt.sign({AccountId, Name, RoleGroupName}, process.env.JWT_SECRET,{expiresIn:"1d"})
    res.status(200).json({
      message: 'Login successful',
      user: {
        AccountId,
        name: Name,
        email: EmailAddress,
        role: RoleGroupName,
        isActive: IsActive,
        isBeta:IsBeta,
        VipLevel:VipLevel,
        NextVipTarget:nextVipTarget[0]?.TargetPoints,
        UsedPoints:UsedPoints,
        points:Points,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  /* ---------------- BASIC VALIDATION ---------------- */
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long"
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    /* ---------------- CHECK USERNAME ---------------- */
    const [existing] = await sqlPool.query(
      "SELECT 1 FROM account WHERE Name = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    /* ---------------- CHECK EMAIL ---------------- */
    const [emailExists] = await sqlPool.query(
      "SELECT 1 FROM account WHERE EmailAddress = ?",
      [email]
    );

    if (emailExists.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    /* ---------------- BETA CHECK ---------------- */
    const [betaCheck] = await sqlPool.query(
      "SELECT 1 FROM beta WHERE user = ? AND Created = 0",
      [username]
    );

    const isBeta = betaCheck.length > 0 ? 1 : 0;
    const createdAt = new Date();

    /* ---------------- ACTIVATION TOKEN ---------------- */
    const activationToken = generateActivationToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    /* ---------------- INSERT ACCOUNT ---------------- */
    await sqlPool.query(
      `INSERT INTO account
       (Name, EmailAddress, Password, RoleGroupName, IsBeta, IsActive, Created, ActivationToken, ActivationExpires)
       VALUES (?, ?, ?, 'Player', ?, 0, ?, ?, ?)`,
      [username, email, password, isBeta, createdAt, activationToken, expires]
    );

    /* ---------------- SEND EMAIL ---------------- */
    await sendActivationEmail(email, username, activationToken);

    /* ---------------- UPDATE BETA ---------------- */
    if (isBeta) {
      await sqlPool.query(
        "UPDATE beta SET Created = 1 WHERE user = ?",
        [username]
      );
    }

    return res.status(201).json({
      message: "Account created successfully. Please check your email to activate your account.",
      isBeta
    });

  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};




export const changePlayerPassword = async (req, res) => {
  const { id: accountId } = req.params;
  const { password , confirmPassword ,oldPassword} = req.body;
  
  if (!oldPassword) {
    return res.status(400).json({ message: 'You Must Enter The Old Password' });
  }
  if (!password || !confirmPassword ||!accountId) {
    return res.status(400).json({ message: 'You Must Enter New Password' });
  }
  if(password !== confirmPassword){
    return res.status(400).json({ message: 'Please Confirm The Password' });
  }

  try {
    const [result] = await sqlPool.query(
      'UPDATE account SET Password = ? WHERE accountId = ? AND Password = ?',
      [password, accountId , oldPassword ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    res.status(200).json({ message: 'Password Changed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const activateAccount = async (req, res) => {
  const { token } = req.params;
  try {
    const [rows] = await sqlPool.query(
      `SELECT * FROM account 
       WHERE ActivationToken = ? 
       AND ActivationExpires > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired activation link" });
    }

    await sqlPool.query(
      `UPDATE account 
       SET IsActive = 1, ActivationToken = NULL, ActivationExpires = NULL
       WHERE ActivationToken = ?`,
      [token]
    );

    res.json({ message: "Account activated successfully. You can now login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};















const generateActivationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
