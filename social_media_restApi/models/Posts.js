const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({
userId:{
    type:String,
    required:true
},
desc:{
    type:String,
    default:""
},
img:{
    type:String,
    default:""
},
likes:{
    type:Array,
    default:[]
}

},{timestamps:true})



module.exports = mongoose.model('Posts', postsSchema)