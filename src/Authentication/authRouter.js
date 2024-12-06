import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Auth, RefreshToken } from './authModel.js';
import {Profile} from '../Profile/profileModel.js'

const AuthRouter = express.Router();

// Generate Key Route (Unchanged)
AuthRouter.get('/generate/key/', async (request, response) => {
  const key = crypto.randomBytes(64).toString('hex');
  response.json(key);
});

// ================== GET USER BY ID ==================
AuthRouter.get('/get/:id/', async (request, response) => {
  console.log('Incoming params:', request.params); // Log the incoming params
  const { id } = request.params // Directly accessing the ID from params
  console.log(id, "id")

  const user = await Auth.findById(id); // Find the user by ID

  if (!user) {
    return response.status(404).json({ message: "User not found." }); // User not found
  }

  response.json(user) // Send the user data back to the client

});


// ================== SIGNUP ==================
AuthRouter.post('/signup/', async (request, response) => {
  const { email, password } = request.body;

  // Validate password length
  if (password.length !== 4) {
    return response.status(400).json({ message: "Password must be exactly 4 characters long." });
  }

  const user_check = await Auth.findOne({ email });
  if (user_check) {
    return response.status(400).json({ message: "User with the Email already exists!" });
  }

  const new_user = new Auth({ email, password });
  await new_user.save();

  const userPayload = { _id: new_user._id, email: new_user.email };
  const access_token = jwt.sign(userPayload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30s' });
  const refresh_token = jwt.sign(userPayload, process.env.REFRESH_TOKEN_KEY);

  const new_refresh_token = new RefreshToken({ refresh_token });
  await new_refresh_token.save();

  response.json({
    status: true,
    message: "User Registered successfully",
    _id: new_user._id,
    access_token,
    refresh_token,
  });
});


// ================== LOGIN ==================
AuthRouter.post('/login/', async (request, response) => {
  const { email, password } = request.body;
  const user_check = await Auth.findOne({ email });

  if (!user_check) {
    return response.status(400).json({ message: "User not exists!" });
  } 
  
  if (user_check.password !== password) {
    return response.status(400).json({ message: "Invalid password" });
  }


  // Find associated profile
  const userProfile = await Profile.findOne({ authId: user_check._id });

  if (!userProfile) {
    return response.status(404).json({ message: "Profile not found" });
  }
  
  const userPayload = { _id : user_check._id,email: user_check.email };
  const access_token = jwt.sign(userPayload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30s' });
  const refresh_token = jwt.sign(userPayload, process.env.REFRESH_TOKEN_KEY);

  const new_refresh_token = new RefreshToken({ refresh_token });
  await new_refresh_token.save();

  response.json({
    status: true,
    message: "Valid user",
    access_token,
    refresh_token,
    userdata: {
       _id: user_check._id, 
       email:user_check.email,
       profileId: userProfile._id,
       },
  });
});


// ================== LOGOUT ==================
AuthRouter.post('/logout/', async (request, response) => {
  const refresh_token = request.body.refresh_token;
  const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY);
  const authId = decoded.authId;

  await Profile.findOneAndUpdate(
    { _id: authId },
    { online: false, lastSeen: new Date() },
    { new: true }
  );

  const tokenRecord = await RefreshToken.findOneAndDelete({ refresh_token });

  if (!tokenRecord) {
    response.status(404).json({ message: 'Token not found' });
  } else {
    response.status(200).json({ message: 'Logged out successfully' });
  }
});

// ================== TOKEN REFRESH ==================
AuthRouter.post('/token/', async (request, response) => {
  const { refresh_token } = request.body;
  if (!refresh_token) return response.status(401).json("No token found");

  const tokenRecord = await RefreshToken.findOne({ refresh_token });
  if (!tokenRecord) return response.status(403).json("Invalid token");

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY, (error, user) => {
    if (error) return response.status(403).json("Token verification failed");

    const access_token = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30s' });
    response.json({ access_token });
  });
});

export default AuthRouter;


