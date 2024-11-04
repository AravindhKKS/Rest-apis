const router = require('express').Router()

//Register
router.get('/home', (req,res) =>{
    res.send("Welcome to Home page")
})

module.exports = router