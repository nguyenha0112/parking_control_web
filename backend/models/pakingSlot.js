const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
    slotNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    vehicleNumber: { type: String, default: null },
});

const ParkingSlot = require('./models/parkingSlot');

// Hàm thêm dữ liệu mẫu
const seedData = async () => {
    await ParkingSlot.insertMany([
        { slotNumber: 'A01' },
        { slotNumber: 'A02' },
        { slotNumber: 'A03' },
    ]);
    console.log('Seeded data!');
}


module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
