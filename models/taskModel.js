const mongoose = require('mongoose');


const TaskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    name: {
        type: String,
        // required: true,
        default: '',
    },
    data: {
        type: String,
        // unique: true,
        // required: true,
        default: '',
    },
    check: {
        type: String,
        default: false
    },
    completed: {
        type: String,
        // required: true,
        default: false,
    },
    startTime: {
        type: String,
        default: '',
        // required: true,
    },
    endTime: {
        type: String,
        default: '',
        // required: true,
    },
});

module.exports = mongoose.model('Task', TaskSchema)