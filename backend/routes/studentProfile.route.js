import express from 'express';
import StudentProfile from '../models/studentProfile.model.js';

import { Clerk } from '@clerk/clerk-sdk-node';

import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


// console.log("CLERK_SCRET_KEY is:", process.env.CLERK_SECRET_KEY);
// console.log("PORT is:", process.env.PORT);

const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });
console.log(clerk);

router.get('/getallusers', async (req, res) => {
  try {
    const users = await clerk.users.getUserList();
    res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching Clerk users:", err);
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
  
})

router.get("/studentProfiles", async (req, res) => {
    try {
      const allProfiles = await StudentProfile.find();
      res.status(200).json(allProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Error fetching student profiles" });
    }
  });


  router.post('/studentProfiles', async (req, res) => {
    try {
      const {
        fullName,
        userId,
        email,
        phone,
        rollNumber,
        department,
        year,
        bio,
        profileImage, // ✅ include this
      } = req.body;
  
      const newStudentProfile = new StudentProfile({
        userId,
        fullName,
        email,
        phone,
        rollNumber,
        department,
        year,
        bio,
        profileImage, // ✅ save this
      });
  
      const savedProfile = await newStudentProfile.save();
      res.status(201).json(savedProfile);
    } catch (error) {
      console.error("Error in POST /studentProfiles:", error);
      res.status(500).json({ message: "Error saving student profile" });
    }
  });
  

router.put('/studentProfiles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProfile = await StudentProfile.findByIdAndUpdate(id, req.body, {new:true});
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(updatedProfile);
    }catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating student profile" });
    }
});


export default router;