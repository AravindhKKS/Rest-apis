const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

//Register
router.post('/register',async (req,res) => {
    const salt =await bcrypt.genSalt(10)
    const hashPassword =await bcrypt.hash(req.body.password,salt)
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword,
    })
try{
    const newUser = await user.save()
    const {password, ...others} = newUser._doc
    res.status(200).json(others)
}catch(err){
    res.status(500).json(err)
}
})

//Login

router.post('/login', async (req,res) => {
    try{
        const findUser = await User.findOne({email:req.body.email})
        !findUser && res.status(401).json('invalid...!')
        const checkPassword = await bcrypt.compare(req.body.password,findUser.password)
        !checkPassword && res.status(401).json('wrong password')
        const {password, ...others} = findUser._doc
    res.status(200).json(others)
    }catch(err){
        res.status(500).json(err + "fix the error")
    }
})


module.exports = router