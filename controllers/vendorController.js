const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.WhatIsYourName;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingVendor = await Vendor.findOne({ email });

    if (existingVendor) {
      return res.status(400).json({ error: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();

    console.log("Vendor registered:", username);
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!secretKey) {
      console.error("JWT Secret Key is undefined. Check .env");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
      expiresIn: '1h',
    });

    console.log("Login successful for:", email);
    res.status(200).json({ success: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllVendors=async(req,res)=>{
  try{
    const vendors=await Vendor.find().populate('firm');
    res.json({vendors})
  }catch(error){
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
const getVendorById = async (req, res) => {
  const vendorId = req.params.apple;

  try {
    const vendor = await Vendor.findById(vendorId).populate('firm'); 
    
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" }); // better to use 404 here
    }

    res.status(200).json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { vendorRegister, vendorLogin , getAllVendors, getVendorById};
