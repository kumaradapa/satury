const path = require('path');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor'); // Use proper naming for the model


// Add Firm controller
const addFirm = async (req, res) => {
  try {
    const { firmName, area, offer } = req.body;

    // Ensure category and region are always arrays
    const category = Array.isArray(req.body.category)
      ? req.body.category
      : req.body.category ? [req.body.category] : [];

    const region = Array.isArray(req.body.region)
      ? req.body.region
      : req.body.region ? [req.body.region] : [];

    const image = req.file ? req.file.filename : undefined;

    // Fetch vendor by ID set by middleware (verifyToken)
    const foundVendor = await Vendor.findById(req.vendorId);
    if (!foundVendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Create and save new firm
    const newFirm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: foundVendor._id
    });

    const savedFirm = await newFirm.save();

    // Push firm ID into vendor's firm list (assumes Vendor model has `firm: []`)
    if (!Array.isArray(foundVendor.firm)) {
      foundVendor.firm = [];
    }

    foundVendor.firm.push(savedFirm._id);
    await foundVendor.save();

    return res.status(201).json({ message: "Firm added successfully", firm: savedFirm });
  } catch (error) {
    console.error("Add Firm Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;
    try{
        const vendor=await Vendor.findById(vendorId);
        if(!vendor){
          return res.status(404).json({error:"vendor not found"})
        }
        res.status(200).json({vendor})
    }
    catch(error){

    }
}
const deletefirmbyid=async(req,res)=>{
   try {
      const firmId=req.params.productId;
      const deletedfirm = await Firm.findByIdAndDelete(firmId)
      if(!deletedfirm){
        return res.status(404).json({error:"not found"})
      }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"internal server error"})
    
  }
}
module.exports = {
   addFirm,
  deletefirmbyid
};
