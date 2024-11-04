const mongoose = require('mongoose')


const TableSchema = new mongoose.Schema({
message:{
type:String,
default:''
},
name:{
    type:String,
    default:""
},
query:{
    type:String,
    required:true
},
type:{
    type:String,
    required:true
}
},{timestamps:true})


module.exports = mongoose.model('Table',TableSchema)