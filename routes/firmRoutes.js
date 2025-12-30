const express = require('express');
const multer = require('multer');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Add firm with image upload
router.post(
  '/add-firm',
  verifyToken,
  upload.single('firmImage'),
  firmController.addFirm
);

// Delete firm
router.delete('/:firmId', firmController.deletefirmbyid);

module.exports = router;
