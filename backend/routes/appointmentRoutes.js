import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const appointments = await Appointment.find().populate('patientId', 'name email').populate('doctorId', 'name specialty');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
