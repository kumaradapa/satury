const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.WhatIsYourName;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.headers.token;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    const vendorId = decoded.vendorId || decoded.id || decoded._id;
    if (!vendorId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    req.vendorId = vendor._id;
    console.log("✅ Token verified, vendor ID:", req.vendorId);
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
  