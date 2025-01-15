const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/parkingSlot');

// Trang chính hiển thị danh sách chỗ đỗ
router.get('/', async (req, res) => {
    try {
        const slots = await ParkingSlot.find();
        res.render('index', { slots });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading parking slots.');
    }
});

// API đặt chỗ
router.post('/reserve', async (req, res) => {
    const { slotId, vehicleNumber } = req.body;

    try {
        const slot = await ParkingSlot.findById(slotId);
        if (!slot || !slot.isAvailable) {
            return res.status(400).send('Slot unavailable.');
        }
        slot.isAvailable = false;
        slot.vehicleNumber = vehicleNumber;
        await slot.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error reserving slot.');
    }
});
router.get('/', async (req, res) => {
    try {
        const slots = await ParkingSlot.find();
        console.log(slots); // Kiểm tra dữ liệu từ MongoDB
        res.render('index', { slots });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading parking slots.');
    }
});
module.exports = router;
