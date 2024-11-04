const express = require('express')
const app = express()
const mongoDB= require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken")
const authRouter = require('./router/auth')
const cors = require('cors')


dotenv.config()
app.use(morgan('common'))
app.use('/api/auth',authRouter)
app.use(express.json())
app.use(cors())

mongoDB.connect(process.env.MONGO_DB).then(() => {
    console.log("DB is Connected Successfully")
}).catch((err) => {
    console.log(err)
})

app.listen(process.env.PORT || 5501, (req,res) => {
    console.log("Backed-end server is connected...!")
})

const users = [
    {
        id:"1",
        username:"aravinth",
        password:"aravinth0908",
        isAdmin:true
    },
    {
        id:"2",
        username:"guna",
        password:"guna0908",
        isAdmin:false
    }
]

const generateAccessToken = (user) => {
   return  jwt.sign({id:user.id, isAdmin:user.isAdmin}, process.env.SEC_KEY,{expiresIn:"5s"})
}
const generateRefreshAccessToken = (user) => {
return jwt.sign({id:user.id, isAdmin:user.isAdmin}, process.env.REF_SEC_KEY)
}

let refreshTokens = []

 
app.post('/api/login',(req,res) => {
    const {username,password} = req.body
    const user = users.find((u) => {
        return u.username === username && u.password === password
    })
    if(user){
       try{
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshAccessToken(user)
        refreshTokens.push(refreshToken)
       res.json({
        username:user.username,
        isAdmin:user.isAdmin,
        accessToken,
        refreshToken
       })
       }catch(err){
        console.log(err +'.something error' )
       }
    }else{
        res.json("username or password is Wrong...!")
    }
})

const verify = (req,res,next) => {
    const authHead = req.headers.access_token
    if(authHead){
     const token = authHead.split(" ")[1]
     jwt.verify(token,process.env.SEC_KEY,(err,user) => {
        if(err){
            res.status(403).json("token is invalid...!")
        }
        req.user = user
        next()
     })
    }else{
        res.status(401).json("Your not authenticated...! ")
    }
}


app.post('/api/refresh', (req,res) => {
// take the refresh token from the user
const refreshToken = req.body.token

//send error to no tokent or invalid tokent
if(!refreshToken) return res.status(401).json('your not authenticated')
if(!refreshTokens.includes(refreshToken)) return res.status(403).json('refresh token is not invalid')
    
//everything is ok create new token and new refresh token send to user
jwt.verify(refreshToken,process.env.REF_SEC_KEY,(err,user) => {
    err && console.log(err)
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshAccessToken(user)
    refreshTokens.push(newRefreshToken)
    
    res.json({
        accessToken:newAccessToken,
        refreshToken:newRefreshToken,
    })
})
})

app.post('/api/logout', verify, (req,res) => {
    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json("Your logged out Successfully...")
    // res.json(refreshTokens)
})


app.delete("/api/users/:userId", verify,(req,res) => {
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("user has been deleted...!")
    }else{
        res.status(500).json("Your not allowed to delete the user...!")
    }
})