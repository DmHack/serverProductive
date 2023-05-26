const mongoose = require('mongoose');


const HabitsSchema = mongoose.Schema({
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
    check: {
        type: String,
        default: false
    },
    completed: {
        type: String,
        // required: true,
        default: false,
    }
});

module.exports = mongoose.model('Habits', HabitsSchema)