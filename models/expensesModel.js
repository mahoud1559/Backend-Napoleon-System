const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expensesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    person:{
        type: String,
        required: true,
    },
    paid:{
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    }, { 
        timestamps: true,
        toJSON: { virtuals: true },
     });

expensesSchema.virtual("remaining").get(function () {
    return this.price - this.paid;
});

module.exports = mongoose.model("Expenses", expensesSchema);
