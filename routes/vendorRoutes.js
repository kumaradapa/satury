const express = require('express'); // ✅ use express
const vendorController = require('../controllers/vendorController');
const router = express.Router(); // ✅ use express's Router
router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);
router.get('/all-vendors', vendorController.getAllVendors);
router.get('/single-vendor/:apple', vendorController.getVendorById)
module.exports = router;
