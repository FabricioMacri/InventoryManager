const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String
    },
    thumbnail: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const InventorySchema = new Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    items: [ItemsSchema]
});

const InventoryModel = mongoose.model('inventorys', InventorySchema);

module.exports = InventoryModel;
