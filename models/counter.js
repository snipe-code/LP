const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: String,
    count: Number
});

module.exports = mongoose.model('Counter', counterSchema);