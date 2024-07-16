const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('blog', blogSchema);