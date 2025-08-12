const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// This applies the multer middleware correctly
router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products',productController.getProductByFirm); 
router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName;
    res.headersSent('Content-Type','image/jpeg');
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
});
router.delete('/:productId',productController.deleteProductbyid)
module.exports = router;
