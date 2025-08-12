const express = require('express');
const path = require('path'); // Needed for file paths
const firmController = require('../controllers/firmController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Add a firm
router.post('/add-firm', verifyToken, firmController.addFirm);

// Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});
router.delete('/:firmId', firmController.deletefirmbyid);
module.exports = router;
