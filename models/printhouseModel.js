const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const expensesSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    },
    price:{
        type: Number,
        required: true
    }
}, {timestamps: true})

const bookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        enum: ["الصف الأول الثانوي", "الصف الثاني الثانوي", "الصف الثالث الثانوي"],
        required: true,
    },
    printPrice: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const printhouseSchema = new Schema({
    name: {
    type: String,
    required: true
    },
    phone: {
        type: String,
        required: true
    },
    expenses: [expensesSchema],
    books: [bookSchema],
    receivables: {
        type: Number,
        required: true,
        default: 0
    },
    payables: {
        type: Number,
        required: true,
        default: 0
    }
    }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

bookSchema.virtual('studentPrice').get(function() {
    return this.profit + this.printPrice;
  });

printhouseSchema.virtual('net').get(function() {
    return this.receivables - this.payables;
});

module.exports = mongoose.model('Print-House', printhouseSchema);