require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        name: 'Diamond Necklace',
        price: 45000,
        priceStr: '₹45,000',
        description: 'This premium diamond necklace is crafted with precision to elevate your elegance.',
        details: {
            Material: 'Gold',
            Stones: 'Diamonds',
            Weight: '12g',
            Purity: '22k'
        },
        image: '/uploads/diamondNecklace.jpg'
    },
    {
        name: 'Gold Pendant Set',
        price: 32500,
        priceStr: '₹32,500',
        description: 'A classic gold pendant set that adds a touch of royalty to any outfit.',
        details: {
            Material: 'Gold',
            Stones: 'None',
            Weight: '8g',
            Purity: '24k'
        },
        image: '/uploads/goldPendantSet.jpg'
    },
    {
        name: 'Pearl Earrings',
        price: 18000,
        priceStr: '₹18,000',
        description: 'Elegant pearl earrings suitable for both casual and formal wear.',
        details: {
            Material: 'Silver',
            Stones: 'Pearls',
            Weight: '5g',
            Purity: '92.5'
        },
        image: '/uploads/pearlEarrings.jpg'
    },
    {
        name: 'Silver Bracelet',
        price: 6500,
        priceStr: '₹6,500',
        description: 'A stylish silver bracelet with intricate patterns.',
        details: {
            Material: 'Silver',
            Stones: 'Zircon',
            Weight: '15g',
            Purity: '92.5'
        },
        image: '/uploads/silverBracelet.jpg'
    },
    {
        name: "Diamond Solitaire Ring",
        price: 45000,
        priceStr: '₹45,000',
        description: "A breathtaking diamond solitaire ring that marks eternal love.",
        details: {
            Material: 'Gold',
            Stones: 'Diamonds',
            Weight: '4g',
            Purity: '18k'
        },
        image: "https://images.unsplash.com/photo-1605100804763-247f67b5548e?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Pearl Drop Earrings",
        price: 12000,
        priceStr: '₹12,000',
        description: "Sophisticated pearl drop earrings designed to dangle beautifully.",
        details: {
            Material: 'Silver',
            Stones: 'Pearls',
            Weight: '6g',
            Purity: '92.5'
        },
        image: "https://images.unsplash.com/photo-1599643478524-fb66f7f2b1f6?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Sapphire & Diamond Ring",
        price: 65000,
        priceStr: '₹65,000',
        description: "An exquisite ring featuring a deep blue sapphire surrounded by sparkling diamonds.",
        details: {
            Material: 'Platinum',
            Stones: 'Sapphire & Diamonds',
            Weight: '5g',
            Purity: '950'
        },
        image: "https://images.unsplash.com/photo-1602751586526-9d0b81a8b16c?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Platinum Wedding Band",
        price: 55000,
        priceStr: '₹55,000',
        description: "A timeless and elegant platinum wedding band.",
        details: {
            Material: 'Platinum',
            Stones: 'None',
            Weight: '8g',
            Purity: '950'
        },
        image: "https://images.unsplash.com/photo-1629807431206-df6b801a2c5a?auto=format&fit=crop&q=80&w=800"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        // Clear existing products to avoid duplicates
        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log('Database populated successfully');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
