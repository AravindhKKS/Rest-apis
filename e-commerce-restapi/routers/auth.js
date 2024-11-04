const router = require('express').Router()
const User = require('../models/Users') 
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

router.post('/register',async (req,res) => {
const newUser = new User({
    username:req.body.username,
    email:req.body.email,
    password:CryptoJS.AES.encrypt(req.body.password,process.env.SEC_PASS),
})
try{
const savedUser = await newUser.save()
const {password, ...others} = savedUser._doc
res.status(201).json(others)
}catch(err){
res.status(500).json(err +'.')
}
})

router.post('/login', async(req,res) => {
try{
    const user = await User.findOne({username:req.body.username})
     !user && res.status(401).json('Wrong credentials...!')
    const decryptPassword = CryptoJS.AES.decrypt(user.password, process.env.SEC_PASS)
    OriginalPassword = decryptPassword.toString(CryptoJS.enc.Utf8)
    OriginalPassword !== req.body.password && res.status(401).json('Wrong credentials...!')

    const accessToken = jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin
    },process.env.JWT_SEC_KEY,{expiresIn:'3d'})
const {password, ...others} = user._doc
    res.status(200).json({...others,accessToken})
}catch(err){
    res.status(500).json(err + '.')
}
})

module.exports = router