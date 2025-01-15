import express from 'express';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './config/bd.js';
import { ENV_VARS } from './config/envVars.js';

const app = express();
const PORT = ENV_VARS.PORT;

console.log("MONGO_URI: ", process.env.MONGO_URI);
app.use(express.json()); 
app.use("/api/v1/auth", authRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to the database", err);
});
// Routes
app.use('/', require('./routes/pakingRoutes'));

const seedData = async () => {
  await ParkingSlot.insertMany([
      { slotNumber: 'A01', isAvailable: true },
      { slotNumber: 'A02', isAvailable: true },
      { slotNumber: 'A03', isAvailable: true },
  ]);
  console.log('Seed data added!');
};

seedData();