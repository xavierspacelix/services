const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/create', authMiddleware, shipmentController.createShipment);
router.put('/update/:id', authMiddleware, shipmentController.updateShipmentStatus);
router.get('/track/:trackingNumber', authMiddleware, shipmentController.trackShipment);
router.get('/user-shipments', authMiddleware, shipmentController.getShipmentsByUser);

module.exports = router;
