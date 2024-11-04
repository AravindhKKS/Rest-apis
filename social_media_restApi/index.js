const express = require('express')
const mongoDB = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const authRouter = require('./router/auth')
const userRouter = require('./router/user')
const postRouter = require('./router/posts')

dotenv.config()

mongoDB.connect(process.env.MONGODB_URL).then(() => {
    console.log('mongoDB is connceted...!')
}).catch((err) => {
console.log(err + 'fix the error')
})

//Middeleware 
app.use(express.json()) // using for postman 
app.use(helmet())
app.use(morgan('common'))


app.use('/api/auth/', authRouter)
app.use('/api/users/', userRouter)
app.use('/api/posts', postRouter)

app.listen('5000', () => {
    console.log('Backend is running...!')
})