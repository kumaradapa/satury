const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const PORT = process.env.PORT || 4000;
dotEnv.config();

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MONGO SUCCESSFUL"))
  .catch((error) => console.log(error));

// ✅ Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Only use this for JSON requests (non-multipart)
app.use(express.json());

// ✅ Routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads',express.static('uploads'));

// ✅ Sample route
app.use('/', (req, res) => {
  res.send("<h1>Welcome To SY</h1>");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server started running at ${PORT}`);
});
