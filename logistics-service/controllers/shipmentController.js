const Shipment = require('../models/Shipment');

exports.createShipment = async (req, res) => {
    const { sender, receiver, details } = req.body;
  
    if (!sender || !receiver || !details) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const trackingNumber = `TRK-${Date.now()}`;
      const newShipment = new Shipment({ ...req.body, trackingNumber, userId: req.user.id });
      await newShipment.save();
      res.status(201).json({ message: 'Shipment created successfully.', shipment: newShipment });
    } catch (err) {
      res.status(500).json({ message: 'Error creating shipment.', error: err.message });
    }
  };

exports.updateShipmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const shipment = await Shipment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }

    res.status(200).json({ message: 'Shipment status updated.', shipment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating shipment status.', error: err.message });
  }
};

exports.trackShipment = async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    const shipment = await Shipment.findOne({ trackingNumber });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }

    res.status(200).json(shipment);
  } catch (err) {
    res.status(500).json({ message: 'Error tracking shipment.', error: err.message });
  }
};

exports.getShipmentsByUser = async (req, res) => {
  try {
    const shipments = await Shipment.find({ userId: req.user.id });
    res.status(200).json(shipments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving shipments.', error: err.message });
  }
};
