const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const auth = require('./routers/auth')

dotenv.config();
app.use(express.json())
app.use(cors())
app.use(morgan("common"))
app.use('/api/auth/',auth)


mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('DB is connected!');
    }).catch((err) => {
        console.log(err);
    });
    
    
    app.listen(5500, () => {
   console.log('BACKEND SERVER IS RUNNING');
})