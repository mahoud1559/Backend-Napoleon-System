const Group = require('../models/groupModel')
const Center = require('../models/centerModel')

const addGroup = async (req, res) => {
    const {name, grade, type, center, maxCount, payment, teacherPricePerClass, centerPricePerClass} = req.body;
    try{
      if(!name || !grade || !type || !center || !maxCount || !payment || !teacherPricePerClass || !centerPricePerClass){
        throw Error('All fields are required.')
      }
      console.log({name, grade, type, center, maxCount, payment, teacherPricePerClass, centerPricePerClass})
      const findCenter = await Center.findOne({name: center})
      const validSeats = maxCount
      const group = new Group({name, grade, type, center, maxCount, validSeats, payment, teacherPricePerClass, centerPricePerClass})
      console.log("Group id: ", group._id)
      findCenter.group.push(group._id)
      console.log("Center: ", findCenter)
      await findCenter.save()
      await group.save()
      console.log("Group added successfully..")
      console.log("Group Added: ", group)
      res.status(201).json(group)
    }
    catch(error){
      console.log("Can not add group");
      res.status(400).json({ error: error.message });
    }
}
const allGroups = async (req, res) => {
  try{
    const groups = await Group.find()
    res.status(200).json(groups)
  }
  catch(error){
    console.log("Can not get groups");
    res.status(400).json({ error: error.message });
  }
}
const getGroup = async (req, res) => {
    try{
      const {grade} = req.params;
      console.log("Grade: ", grade)
      const groups = await Group.find({grade})
      console.log("Groups: ", groups)
      res.status(200).json(groups)
    }
    catch(error){
      console.log("Can not get groups");
      res.status(400).json({ error: error.message });
    }
}

const editGroup = async (req, res) =>{
  const {id} = req.params;
  const {name, grade, type, center, maxCount, payment} = req.body;
  
  try{
    const group = await Group.findById({"_id": id})

    if(!group){
      throw Error('Group not found')
    }
    
    if(name) group.name = name
    if(grade) group.grade = grade
    if(type) group.type = type
    if(center) group.center = center
    if(maxCount) group.maxCount = maxCount
    if(payment) group.payment = payment

    await group.save()
    res.status(200).json(group)
  }
  catch(error){
    console.log("Can not edit group");
    res.status(402).json({ error: error.message });
  }
}

const deleteAllGroups = async (req, res) => {
  try{
    await Group.deleteMany()
    res.status(200).json({message: 'All groups deleted successfully'})
  }
  catch(error){
    console.log("Can not delete groups");
    res.status(400).json({ error: error.message });
  }
}
module.exports = {addGroup, getGroup, allGroups, editGroup, deleteAllGroups}