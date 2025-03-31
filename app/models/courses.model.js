const mongoose = require('mongoose');

//=============== Prepere Schema ==============//
const courseSchema = new  mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

//============= Create The Model ===============//
const Course = mongoose.model('Course', courseSchema);

//============= Export the model ===============//
module.exports = Course;