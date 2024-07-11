const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const Schema = mongoose.Schema

const moneySchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    moneyDetails: [{
            studentCode: {
                type: String,
                required: true
            },
            studentName: {
                type: String,
                required: true
            },
            totalPaid: {
                type: Number,
                default: 0
            },
            centerMoney: {
                type: Number,
                default: 0
            },
            date: {
                type: Date,
                default: Date.now
            },
            group:{
                type: String,
                required: true
        }
    }],
    amount: {
        type: Number,
        default: 0
    },
    paid: {
        type: Number,
        default: 0
    },
    remaining: {
        type: Number,
        default: 0
    }
})

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
    money: [moneySchema],
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