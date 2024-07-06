const Center = require('../models/centerModel');

const addCenter = async (req, res) => {
    const {name, phone} = req.body;
    try{
        if(!name || !phone){
            throw Error('All fields are required.')
        }
        const center = new Center({name, phone})
        await center.save()
        console.log("Center added successfully..")
        console.log("Center Added: ", center)
        res.status(201).json(center)
    }
    catch(error){
        console.log("Can not add center");
        res.status(400).json({ error: error.message });
    }
}

const allCenters = async (req, res) => {
    try{
        const centers = await Center.find()
        res.status(200).json(centers)
    }
    catch(error){
        console.log("Can not get centers");
        res.status(400).json({ error: error.message });
    }
}

const centerByName = async (req, res) => {
    const {name} = req.params
    console.log("Center name: ", name)
    try{
        const center = await Center.findOne({name}).populate('money.moneyDetails.group')
        res.status(200).json(center)
    }
    catch(error){
        console.log("Can not get center");
        res.status(400).json({ error: error.message });
    }
}

const deleteCenter = async (req, res) => {
    const {name} = req.body
    try{
        const center = await Center.findOneAndDelete({name})
        .populate('money.moneyDetails.group')
        console.log("Center deleted successfully..")
        res.status(200).json({message:"Center deleted successfully.."})
    }
    catch(error){
        console.log("Can not delete center");
        res.status(400).json({ error: error.message });
    }
}

module.exports = {addCenter, allCenters, centerByName, deleteCenter}