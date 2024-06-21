const Admin = require('../models/AdminModel')
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '3d'})
  }
const addAdmin = async (req, res) => {
    const {type, username, password} = req.body;
    try{
      if(!type || !username || !password){
        throw Error('All fields are required.')
      }
      const admin = new Admin({type, username, password})
      await admin.save()
      console.log("Admin added successfully..")
      res.status(201).json(admin)
    }
    catch(error){
      console.log("Can not add admin");
      res.status(400).json({ error: error.message });
    }
}
const loginAdmin = async (req, res) => {
    console.log("here received request..s")
    const {username, password} = req.body
    console.log({username, password})
    try{
      if(!username || !password){
        throw Error('All fields are required.')
      }
      const admin = await Admin.findOne({username})
      if(!admin){
        throw Error('Wrong Username')
      }

      if(!(admin.password == password)){
        throw Error('Wrong Password')
      }
      const token = createToken(admin._id)
      console.log("Logged In Successfully..")
      res.status(200).json({username, token})
    }
    catch(error){
      console.log("Catch Error: Can not log ya abdo")
      res.status(422).json({error: error.message})
    }
  }
const alladmins = async (req, res) => {
    try{
      const admins = await Admin.find({});
      res.status(200).json(admins);
  
    } catch(error){
      console.log("Can not retrieve admins");
      res.status(400).json({ error: error.message });
    }
}
  

module.exports = { loginAdmin, alladmins, addAdmin}