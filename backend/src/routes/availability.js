const express = require('express');
const router = express.Router();
const AvailabilityController = require('../controllers/availabilityController');

// Todas as rotas são públicas para o sistema de agendamento funcionar
router.get('/dates', AvailabilityController.getAvailableDates);
router.get('/slots', AvailabilityController.getAvailableSlots);
router.get('/check', AvailabilityController.checkAvailability);
router.get('/prices', AvailabilityController.getPrices);

module.exports = router;
