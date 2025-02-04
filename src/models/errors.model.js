const mongoose = require("mongoose");

const ErrorsSchema = new mongoose.Schema({

    code: {
        type: Number,
        required: true
    },
    type: {
        type:String,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    message: {
        type:String,
        required:true
    }
    
}, {
    timestamps: true
});

const ErrorsModel = mongoose.model("errors", ErrorsSchema);

module.exports = ErrorsModel;