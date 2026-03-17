const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    priceStr: { type: String, required: true },
    description: { type: String },
    details: {
        Material: String,
        Stones: String,
        Weight: String,
        Purity: String
    },
    image: { type: String } // Placeholder for future
});

module.exports = mongoose.model('Product', productSchema);
