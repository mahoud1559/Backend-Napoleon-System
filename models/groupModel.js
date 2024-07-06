const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const Schema = mongoose.Schema
const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        enum: ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'],
        required: true
    },
    type: {
        type: String,
        enum: ['دابل', 'عادي'],
        default: 'دابل'
    },
    center: {
        type: String,
        required: true
    },
    maxCount: {
        type: Number,
        required: true
    },
    currentClass:{
        type: Number,
        default: 0
    },
    currentMonth:{
        type: Number,
        default: 1
    },
    classActive: {
        type: Boolean,
        default: false
    },
    validSeats: {
        type: Number,
        required: true
    },
    payment: {
        type: String,
        enum: ['دفع بالحصة', 'دفع بالشهر'],
        required: true
    },
    teacherPricePerClass: {
        type: Number,
        required: true
    },
    centerPricePerClass: {
        type: Number,
        required: true
    },
}, 
{toJSON : {virtuals: true}, 
toObject : {virtuals: true}}
)
groupSchema.virtual('pricePerClass').get(function(){
    return this.teacherPricePerClass + this.centerPricePerClass
})
groupSchema.virtual('pricePerMonth').get(function(){
    return this.pricePerClass * 8
})

module.exports = mongoose.model('Group', groupSchema)