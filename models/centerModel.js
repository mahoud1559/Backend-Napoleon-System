const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const Schema = mongoose.Schema
const centerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    group: [{
        type: ObjectId,
        ref: 'Group'
    }],
    paid: {
        type: Number,
        default: 0
    },
    remaining: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Center', centerSchema)