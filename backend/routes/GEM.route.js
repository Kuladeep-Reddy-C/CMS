import express from 'express';
import { GEMmodel } from '../models/GEM.model.js';


import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();



router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await GEMmodel.find({ userId });
        console.log(data);

        // Check if data is empty
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No groups found for this user' });
        }

        // Destructure and transform the data
        const transformedData = data;

        res.status(200).json(transformedData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', async (req,res) => {
    try {
        console.log("Incoming data:", req.body);
        const data = req.body;
        const newGEM = new GEMmodel(data);

        const savedGEM = await newGEM.save();

        if (!savedGEM) {
            return res.status(500).json({ message: 'Failed to save group expense' });
        }
        res.status(201).json(savedGEM);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

router.patch('/:groupId/member-expense/:expenseIndex', async (req, res) => {
    const { groupId, expenseIndex } = req.params;
    const { paymentStatus } = req.body; // Expecting { paymentStatus: 'Pending' | 'Paid' }

    try {
        // Find the group by ID
        const group = await GEMmodel.findById(groupId);
        
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Find the specific member expense by index
        const memberExpense = group.memberExpenses[parseInt(expenseIndex)];

        if (!memberExpense) {
            return res.status(404).json({ message: 'Member expense not found' });
        }

        // Toggle payment status if it's not provided, or update if provided
        const newStatus = paymentStatus || (memberExpense.paymentStatus === 'Paid' ? 'Pending' : 'Paid');
        
        memberExpense.paymentStatus = newStatus;

        // Save the updated group
        await group.save();

        // Return the updated member expense
        res.status(200).json({ memberExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update payment status' });
    }
});


export default router
