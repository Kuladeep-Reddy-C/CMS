// import express from 'express';
// import CalendarModel from '../models/calendar.model.js';

// const router = express.Router();

// // POST route to save calendar data
// router.post('/', async (req, res) => {
//     try {
//         const data = req.body;
//         const newData = new CalendarModel(data);
//         const savedData = await newData.save();
//         if (!savedData) {
//             return res.status(500).json({ message: "Server Error" });
//         }
//         res.status(201).json({ message: "Success", data: savedData });
//     } catch (error) {
//         console.error('POST /calendar error:', error);
//         return res.status(500).json({ message: "Error: " + error.message });
//     }
// });

// // GET route to fetch calendar data for a specific user
// router.get('/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const data = await CalendarModel.find();
//         const filteredData = data.filter((calendarData) =>
//             calendarData.groupMembers.includes(userId)
//         );
//         res.status(200).json({ data: filteredData });
//     } catch (error) {
//         console.error('GET /calendar/:userId error:', error);
//         res.status(500).json({ message: "Error: " + error.message });
//     }
// });

// // PUT route to update the calendar array for a specific group
// router.put('/:groupId', async (req, res) => {
//     try {
//         const groupId = req.params.groupId;
//         const { calendar } = req.body;
//         console.log('PUT /calendar/:groupId received:', { groupId, calendar });

//         if (!calendar || !Array.isArray(calendar)) {
//             return res.status(400).json({ message: 'Invalid calendar data' });
//         }

//         const updatedGroup = await CalendarModel.findByIdAndUpdate(
//             groupId,
//             { $set: { calendar } },
//             { new: true }
//         );

//         if (!updatedGroup) {
//             return res.status(404).json({ message: 'Group not found' });
//         }

//         res.status(200).json({ message: 'Calendar updated', data: updatedGroup });
//     } catch (error) {
//         console.error('PUT /calendar/:groupId error:', error);
//         res.status(500).json({ message: 'Error: ' + error.message });
//     }
// });

// export default router;


import express from 'express';
import CalendarModel from '../models/calendar.model.js';

const router = express.Router();

// POST route to save calendar data
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newData = new CalendarModel(data);
        const savedData = await newData.save();
        if (!savedData) {
            return res.status(500).json({ message: "Server Error" });
        }
        res.status(201).json({ message: "Success", data: savedData });
    } catch (error) {
        console.error('POST /calendar error:', error);
        return res.status(500).json({ message: "Error: " + error.message });
    }
});

// GET route to fetch calendar data for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await CalendarModel.find();
        const filteredData = data.filter((calendarData) =>
            calendarData.groupMembers.includes(userId)
        );
        res.status(200).json({ data: filteredData });
    } catch (error) {
        console.error('GET /calendar/:userId error:', error);
        res.status(500).json({ message: "Error: " + error.message });
    }
});

// PUT route to update the calendar array for a specific group
router.put('/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { calendar } = req.body;
        console.log('PUT /calendar/:groupId received:', { groupId, calendar });

        if (!calendar || !Array.isArray(calendar)) {
            return res.status(400).json({ message: 'Invalid calendar data' });
        }

        const updatedGroup = await CalendarModel.findByIdAndUpdate(
            groupId,
            { $set: { calendar } },
            { new: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Calendar updated', data: updatedGroup });
    } catch (error) {
        console.error('PUT /calendar/:groupId error:', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
});

router.delete('/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        console.log('DELETE /calendar/:groupId received:', { groupId });

        const deletedGroup = await CalendarModel.findByIdAndDelete(groupId);

        if (!deletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('DELETE /calendar/:groupId error:', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
});

export default router;