const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.WhatIsYourName; // ✅ case-sensitive fix

const verifyToken = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1]; // ✅ more flexible

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    const vendor = await Vendor.findById(decoded.vendorId); // ✅ fixed: it's `findById`, not `findByID`
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    req.vendorId = vendor._id; 
    console.log("✅ Token verified, vendor ID:", req.vendorId);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" }); // ✅ more accurate status code
  }
};

module.exports = verifyToken;
