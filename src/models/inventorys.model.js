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
        required: true
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
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    items: {
        type: [ItemsSchema],
        default: [] // Por defecto es un array vacío
    }
});

// Validación única manual para items.code dentro de cada inventario
InventorySchema.pre('save', function(next) {
    const inventory = this;
    const codes = inventory.items.map(item => item.code);
    const uniqueCodes = new Set(codes);
    if (codes.length !== uniqueCodes.size) {
        return next(new Error('Los códigos de los ítems deben ser únicos dentro de cada inventario.'));
    }
    next();
});

const InventoryModel = mongoose.model('inventorys', InventorySchema);

module.exports = InventoryModel;
