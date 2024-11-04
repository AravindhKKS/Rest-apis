const mongoose = require('mongoose')

const UserSchema =  new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    coverPicture:{
        type:String,
        default:""
    },
    profilePicture:{
        type : String,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    followings:{
        type:Array,
        default:[]
    },
    desc:{
       type:String,
       default:""
    },
    city:{
       type:String,
       default:""
    },
    from:{
       type:String,
       default:""
    },
    relationship:{
       type:Number, 
       enum:[1,2,3]
    },
     isAdmin:{
        type:Boolean,
        default:false,
     },
},{timestamps:true})


module.exports = mongoose.model('User',UserSchema)