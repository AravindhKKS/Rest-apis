
const router = require('express').Router()
const Table = require('../modules/TestSchema')

//CREATE THE TABLE DATA

router.post('/', async(req,res) => {
try{
    const newTable = new Table({
message:req.body.message,
name:req.body.name,
query:req.body.query,
type:req.body.type
})
 const savedTable = await newTable.save()
 res.status(200).json(savedTable)
 }catch(err){
res.status(500).json(err + ' fix the error')
}
})

// GET THE TABLE DATA

router.get('/', async(req, res) => {
    try {
        const allTables = await Table.find()
        res.status(200).json(allTables)
    } catch (err) {
        res.status(500).json(err)
    }
})

//UPDATE THE TABLE DATA

router.put('/:id', async(req,res) => {
    if(req.body.userId === req.params.id){
       try{
            const updateUser = await Table.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true})
            res.status(200).json(updateUser)
       }catch(err){
        res.status(500).json(err + " fix the error")
       }
    }else{
        res.status(402).json('You only update you data')
    }

})


//DELETE THE DATA

router.delete('/:id', async(req,res) => {
    if(req.body.userId === req.params.id){
       try{
            const updateUser = await Table.findByIdAndDelete(req.params.id)
            res.status(200).json('Your data was deleted...!')
       }catch(err){
        res.status(500).json(err + " fix the error")
       }
    }else{
        res.status(402).json('You only delete you data')
    }

})



module.exports = router