require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const http = require('http');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); 

const server = http.createServer(app);
<<<<<<< HEAD

=======
const io = new Server(server, {
  cors: {
    origin: "https://stockpulse-awx2.onrender.com", 
    methods: ["GET", "POST"]
  }
});
>>>>>>> 9b6dde6d35179f45dde0de30ecf888446b007d3a
// --- MONGOOSE DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✓ Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('✗ MongoDB connection error:', err));

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// --- IN-FILE SCHEMAS ---

// 1. Owner Profile Schema
const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

const Owner = mongoose.model('Owner', OwnerSchema);

// 2. Product Schema (For Menu Items)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  imageUrl: { type: String, default: "" },          
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// 3. Gallery / Occasion Media Schema (For Promotional Photos/Videos)
const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, 
  description: { type: String, trim: true, default: "" }, 
  mediaType: { type: String, enum: ['image', 'video'], required: true }, 
  mediaUrl: { type: String, required: true } 
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', GallerySchema);


/* =========================================================
   1. OWNER AUTHENTICATION ENDPOINTS
   ========================================================= */

app.post('/api/auth/register-owner', async (expressReq, expressRes) => {
  try {
    const { name, email, password } = expressReq.body;

    if (!email || !password || !name) {
      return expressRes.status(400).json({ error: "All profile fields are required." });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return expressRes.status(400).json({ error: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new Owner({ name, email, password: hashedPassword });
    const savedOwner = await newOwner.save();
    
    const token = jwt.sign(
      { id: savedOwner._id },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    );

    expressRes.status(201).json({ message: "Registration successful!", token, name: savedOwner.name });
  } catch (err) { expressRes.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (expressReq, expressRes) => {
  try {
    const { email, password } = expressReq.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return expressRes.status(400).json({ error: "Invalid email." });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return expressRes.status(400).json({ error: "Incorrect password." });

    const token = jwt.sign(
      { id: owner._id },
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '24h' }
    );

    expressRes.json({ message: "Authentication successful!", token, name: owner.name });
  } catch (err) { expressRes.status(500).json({ error: err.message }); }
});


/* =========================================================
   2. INVENTORY MANAGEMENT ENDPOINTS (Products)
   ========================================================= */

// GET: Fetch all products
app.get('/api/products', async (expressReq, expressRes) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    expressRes.json(products);
  } catch (err) {
    expressRes.status(500).json({ error: err.message });
  }
});

// POST: Create a new product with Cloudinary Upload
app.post('/api/products', async (expressReq, expressRes) => {
  try {
    const { name, price, stock, imageBase64 } = expressReq.body;
    let imageUrl = "";

    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "dcrocrotisseria_products",
      });
      imageUrl = uploadResponse.secure_url; 
    }

    const newProduct = new Product({ 
      name, 
      price, 
      stock, 
      imageUrl 
    }); 

    const savedProduct = await newProduct.save();
    expressRes.status(201).json(savedProduct);

  } catch (err) { 
    console.error(err);
    expressRes.status(400).json({ error: err.message }); 
  }
});

// PUT (update) a product with optional new Cloudinary Upload
app.put('/api/products/:id', async (expressReq, expressRes) => {
  try {
    const { name, price, stock, imageBase64, imageUrl: existingImageUrl } = expressReq.body;
    let imageUrl = existingImageUrl;

    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "dcrocrotisseria_products",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      expressReq.params.id, 
      { name, price, stock, imageUrl }, 
      { new: true }
    );
    
    expressRes.json(updatedProduct);
  } catch (err) { 
    console.error(err);
    expressRes.status(400).json({ error: err.message }); 
  }
});

// DELETE a product
app.delete('/api/products/:id', async (expressReq, expressRes) => {
  try {
    await Product.findByIdAndDelete(expressReq.params.id);
    expressRes.json({ message: "Product removed successfully" });
  } catch (err) { expressRes.status(500).json({ error: err.message }); }
});


/* =========================================================
   3. GALLERY & OCCASION MEDIA ENDPOINTS
   ========================================================= */

app.get('/api/gallery/customer', async (expressReq, expressRes) => {
  try {
    const galleryItems = await Gallery.find({}).sort({ createdAt: -1 });
    expressRes.json(galleryItems);
  } catch (err) { 
    expressRes.status(500).json({ error: err.message }); 
  }
});

app.post('/api/gallery/owner', async (expressReq, expressRes) => {
  try {
    const { title, description, mediaType, mediaBase64 } = expressReq.body;
    
    if (!mediaBase64) {
      return expressRes.status(400).json({ error: "Nenhum arquivo de mídia foi enviado ou o arquivo excede o limite de tamanho." });
    }

    let mediaUrl = "";

    const uploadResponse = await cloudinary.uploader.upload(mediaBase64, {
      folder: "dcrocrotisseria_gallery",
      resource_type: mediaType === 'video' ? 'video' : 'image'
    });
    mediaUrl = uploadResponse.secure_url;

    const newMedia = new Gallery({ 
      title: title || "Novidade D'Croc", 
      description, 
      mediaType, 
      mediaUrl 
    }); 

    const savedMedia = await newMedia.save();
    expressRes.status(201).json(savedMedia);
  } catch (err) { 
    console.error("Gallery Upload Error:", err);
    expressRes.status(400).json({ error: err.message }); 
  }
});
app.delete('/api/gallery/owner/:id', async (expressReq, expressRes) => {
  try {
    await Gallery.findByIdAndDelete(expressReq.params.id);
    expressRes.json({ message: "Gallery media removed successfully" });
  } catch (err) { 
    expressRes.status(500).json({ error: err.message }); 
  }
});
/* =========================================================
   3. GALLERY & OCCASION MEDIA ENDPOINTS
   ========================================================= */

app.get('/api/gallery/customer', async (expressReq, expressRes) => {
  try {
    const galleryItems = await Gallery.find({}).sort({ createdAt: -1 });
    expressRes.json(galleryItems);
  } catch (err) { 
    expressRes.status(500).json({ error: err.message }); 
  }
});

// POST: Upload photo or video reel to Cloudinary and save to Gallery
app.post('/api/gallery/owner', async (expressReq, expressRes) => {
  try {
    const { title, description, mediaType, mediaBase64 } = expressReq.body;
    let mediaUrl = "";

    if (mediaBase64) {
      // Upload to Cloudinary. For videos, resource_type must be set to 'auto' or 'video'
      const uploadResponse = await cloudinary.uploader.upload(mediaBase64, {
        folder: "dcrocrotisseria_gallery",
        resource_type: mediaType === 'video' ? 'video' : 'image'
      });
      mediaUrl = uploadResponse.secure_url;
    }

    const newMedia = new Gallery({ 
      title: title || "Novidade D'Croc", 
      description, 
      mediaType, 
      mediaUrl 
    }); 

    const savedMedia = await newMedia.save();
    expressRes.status(201).json(savedMedia);
  } catch (err) { 
    console.error(err);
    expressRes.status(400).json({ error: err.message }); 
  }
});

app.delete('/api/gallery/owner/:id', async (expressReq, expressRes) => {
  try {
    await Gallery.findByIdAndDelete(expressReq.params.id);
    expressRes.json({ message: "Gallery media removed successfully" });
  } catch (err) { 
    expressRes.status(500).json({ error: err.message }); 
  }
});



// --- START SERVER ---
const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
server.listen(PORT, () => console.log(`✓ dcrocrotisseria backend is running on port ${PORT}`));
=======
server.listen(PORT, () => console.log(`✓ Real-time server streaming on port ${PORT}`));
>>>>>>> 9b6dde6d35179f45dde0de30ecf888446b007d3a
