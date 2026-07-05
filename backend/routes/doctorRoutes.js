import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const doctor = await User.create({ ...req.body, role: 'doctor' });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
