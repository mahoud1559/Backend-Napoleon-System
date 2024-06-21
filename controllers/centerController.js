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

module.exports = {addCenter, allCenters}