const Product = require("../models/Product");
const Firm = require('../models/Firm');
const multer = require("multer");
const path = require("path"); // ✅ Needed for file extension

// ✅ Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const Upload = multer({ storage });


const addProduct = async (req, res) => {
  try {
    
    // ✅ SAFELY check req.body
    if (!req.body) {
      return res.status(400).json({ error: "Missing form data" });
    }

    // ✅ Use proper destructuring
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      Image: image, // ✅ Use image from multer
      bestSeller: bestseller,
      description,
      firm: firm._id
    });

    const savedProduct = await product.save(); // ✅ Save the product
    firm.products.push(savedProduct._id);      // ✅ Push only the ID
    await firm.save();                         // ✅ Don't forget ()

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getProductByFirm =async(req,res)=>{
  try {
    const firmId= req.params.firmId;
    const firm=await Firm.findById(firmId);
    if(!firm){
      return res.status(404).json({errpr:"no firm found"})
    }
    const restName=firm.firmName
    const products=await Product.find({firm:firmId});
    res.status(200).json({restName , products});
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
const deleteProductbyid= async(req,res)=>{
  try {
      const productId=req.params.productId;
      const deletedprodut = await Product.findByIdAndDelete(productId)
      if(!deletedproduct){
        return res.status(404).json({error:"not found"})
      }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"internal server error"})
    
  }
}
module.exports = {
  addProduct: [Upload.single('image'), addProduct], getProductByFirm, deleteProductbyid 
};
