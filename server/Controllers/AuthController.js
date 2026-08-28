import sqlPool from '../db/sqlConnection.js';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { sendActivationEmail } from "../middleware/emailMiddleware.js";

import { HttpError } from '../Models/errorModel.js';

const verifyTurnstile = async (token) => {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success;
};


export const loginUser = async (req, res , next) => {
  const { username, password, turnstileToken } = req.body;
  try {
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return res.status(403).json({ message: 'Bot verification failed. Please refresh and try again.' });
    }
    const [sqlResult] = await sqlPool.query(
      'SELECT * FROM account WHERE Name = ? AND BINARY Password = ?',
      [username, password]
    );
    if (!sqlResult||sqlResult.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // console.log(sqlResult[0].IsActive)
    if(sqlResult[0].IsActive !== 1){
      return res.status(401).json({ message: ' BANNED OR Not ACTIVATED Yet Please Check Your E-Mail' });
    }

    const user = sqlResult[0];
    const { AccountId, Name, RoleGroupName , Points} = user;

    // const [nextVipTarget] = await sqlPool.query(
    //   'SELECT TargetPoints FROM viplevels WHERE VipLevel = ?',
    //   [VipLevel < 20 ? (VipLevel + 1) : VipLevel]
    // );

    const token = jwt.sign({AccountId, Name, RoleGroupName}, process.env.JWT_SECRET,{expiresIn:"1d"})
    res.status(200).json({
      message: 'Login successful',
      user: {
        // AccountId,
        // name: Name,
        // email: EmailAddress,
        // role: RoleGroupName,
        // isActive: IsActive,
        // isBeta:IsBeta,
        // VipLevel:VipLevel,
        // NextVipTarget:nextVipTarget[0]?.TargetPoints,
        // UsedPoints:UsedPoints,
        points:Points,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword, turnstileToken } = req.body;

  const isHuman = await verifyTurnstile(turnstileToken);
  if (!isHuman) {
    return res.status(403).json({ message: 'Bot verification failed. Please refresh and try again.' });
  }

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
  const { AccountId } = req.user;
  const { password , confirmPassword ,oldPassword} = req.body;
  
  if (!oldPassword) {
    return res.status(400).json({ message: 'You Must Enter The Old Password' });
  }
  if (!password || !confirmPassword ||!AccountId) {
    return res.status(400).json({ message: 'You Must Enter New Password' });
  }
  if(password !== confirmPassword){
    return res.status(400).json({ message: 'Please Confirm The Password' });
  }

  try {
    const [result] = await sqlPool.query(
      'UPDATE account SET Password = ? WHERE accountId = ? AND Password = ?',
      [password, AccountId , oldPassword ]
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


export const getUserData = async (req, res) => {
  try {
    // console.log(req.user)
    const { AccountId } = req.user;

    const [sqlResult] = await sqlPool.query(
      `SELECT Name, EmailAddress, RoleGroupName, 
              IsBeta, Points, VipLevel, UsedPoints
       FROM account
       WHERE AccountId = ?`,
      [AccountId]
    );

    if (!sqlResult.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = sqlResult[0];

    const [nextVipTarget] = await sqlPool.query(
      `SELECT TargetPoints FROM viplevels WHERE VipLevel = ?`,
      [user.VipLevel < 20 ? user.VipLevel + 1 : user.VipLevel]
    );

    res.status(200).json({
      ...user,
      NextVipTarget: nextVipTarget[0]?.TargetPoints || null,
    });

  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const IsAdmin = async (req, res) => {
  try {
    const { AccountId, Name, RoleGroupName} = req.user;
    if (!AccountId || !Name || !RoleGroupName) {
      return res.status(403).json({ message: "Invalid User" });
    }
    
    if(RoleGroupName !== "Owner" || Name !== "gmfirst"){
      return res.status(200).json({ normalUser: true });
    }

    const [sqlResult] = await sqlPool.query(
      `SELECT Name, AccountId, RoleGroupName
       FROM account
       WHERE AccountId = ?`,
      [AccountId]
    );

    if (!sqlResult.length) {
      return res.status(403).json({ message: "User not found" });
    }

    const user = sqlResult[0];

    // console.log(user)
    if(user.RoleGroupName !== "Owner" || user.Name !== "gmfirst"){
      return res.status(403).json({ message: "Invalid User Role Or Admin" });
    }

    const token = jwt.sign({AccountId, Name, RoleGroupName}, process.env.JWT_SECRET,{expiresIn:"1d"})

    res.status(200).json({
      normalUser: false,
      token
    });

  } catch (err) {
    res.status(500).json({ error: err });
  }
}

















const generateActivationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
