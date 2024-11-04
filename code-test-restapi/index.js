const express= require('express')
const app = express()
const mongoose= require('mongoose')
const dotenv = require('dotenv')
const userTable = require('./router/table')


dotenv.config()

app.use(express.json())
app.use('/login', (req,res) => {
    console.log('this is login page')
})

app.use('/api/table',userTable )


app.listen('5501', () => {
    console.log('Background Server is Connted...!')
})

mongoose.connect(process.env.MONGODB_URL).then(
    console.log('DB is connected...!')
).catch((err) => {
    console.log(err)
})