require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Models
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const API = import.meta.env.VITE_API_URL;
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jewellery')
    .then(() => {
        console.log('MongoDB connected');
        seedProducts();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// --- Seed Initial Data ---
const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const products = [
                {
                    name: 'Diamond Necklace',
                    price: 45000,
                    priceStr: '₹45,000',
                    description: 'This premium diamond necklace is crafted with precision to elevate your elegance.',
                    details: { Material: 'Gold', Stones: 'Diamonds', Weight: '12g', Purity: '22k' },
                    image: "/uploads/diamondNecklace.jpg"
                },
                {
                    name: 'Gold Pendant Set',
                    price: 32500,
                    priceStr: '₹32,500',
                    description: 'A classic gold pendant set that adds a touch of royalty to any outfit.',
                    details: { Material: 'Gold', Stones: 'None', Weight: '8g', Purity: '24k' },
                    image: "/uploads/goldPendantSet.jpg"
                },
                {
                    name: 'Pearl Earrings',
                    price: 18000,
                    priceStr: '₹18,000',
                    description: 'Elegant pearl earrings suitable for both casual and formal wear.',
                    details: { Material: 'Silver', Stones: 'Pearls', Weight: '5g', Purity: '92.5' },
                    image: "/uploads/pearlEarrings.jpg"
                },
                {
                    name: 'Silver Bracelet',
                    price: 6500,
                    priceStr: '₹6,500',
                    description: 'A stylish silver bracelet with intricate patterns.',
                    details: { Material: 'Silver', Stones: 'Zircon', Weight: '15g', Purity: '92.5' },
                    image: "/uploads/silverBracelet.jpg"
                },
            ];
            await Product.insertMany(products);
            console.log('Products seeded');
        }
    } catch (err) {
        console.error("Seeding error:", err);
    }
};


// --- Routes ---

// 1. Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        // Transform _id to id for frontend compatibility if needed, or update frontend to use _id
        res.json(products.map(p => ({ ...p.toObject(), id: p._id })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Get Single Product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ ...product.toObject(), id: product._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Auth: Signup
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, email, password }); // Password should be hashed in real app
        await newUser.save();

        // Initialize cart
        await Cart.create({ userId: newUser._id, items: [] });

        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Auth: Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password }); // Plain text pending hash

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Cart: Get Cart
app.get('/api/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.json([]);
        }

        // Hydrate product details
        const fullCart = cart.items.map(item => {
            if (!item.productId) return null; // Filter out if product deleted
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                product: item.productId // populated
            };
        }).filter(Boolean);

        res.json(fullCart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. Cart: Add to Cart
app.post('/api/cart/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += (quantity || 1);
        } else {
            cart.items.push({ productId, quantity: quantity || 1 });
        }
        await cart.save();
        res.json({ message: 'Item added to cart', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. Cart: Update Quantity
app.put('/api/cart/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ message: 'Cart not found' });

        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            const item = cart.items.find(item => item.productId.toString() === productId);
            if (item) item.quantity = quantity;
        }
        await cart.save();
        res.json({ message: 'Cart updated', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 8. Place Order
app.post('/api/orders', async (req, res) => {
    const { userId, items, total } = req.body;
    try {
        // Create Order
        const order = new Order({
            userId,
            items: items.map(i => ({
                productId: i.id, // mapped from frontend as id
                quantity: i.qty,
                price: i.price
            })),
            total
        });
        await order.save();

        // Clear Cart
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        res.json({ message: 'Order placed successfully!', orderId: order._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
