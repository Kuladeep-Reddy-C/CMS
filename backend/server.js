import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import groupExpensesForm from './routes/GEM.route.js';
import gp2 from './routes/GEM2.route.js';
import calendarRoute from './routes/calender.route.js';
import sendMail from './routes/sendMail.route.js'
import studentProfile from './routes/studentProfile.route.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

console.log(MONGO_URI);

app.use(cors());
app.use(express.json());

mongoose
    .connect(MONGO_URI)
    .then(()=> console.log('✅MongoDB connected'))
    .catch((err) => console.log(err));


// Routes
app.use('/api', groupExpensesForm);
app.use('/api2', gp2);
app.use('/api3', sendMail);
app.use('/member', studentProfile);
app.use('/calendar',calendarRoute)

app.listen(PORT, ()=>{
    console.log(`✅Server is running on port ${PORT}`);
})
