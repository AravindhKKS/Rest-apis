const router = require('express').Router()
const Posts = require('../models/Posts')
const Users = require('../models/User')


//CREATE THE POST
router.post('/', async (req, res) => {
    const newPost = new Posts(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(200).json(err + ' fix the error')
    }
})

//UPDATE THE POST
router.put('/:id', async (req, res) => {
    try {
        const findPost = await Posts.findById(req.params.id)
        if (findPost.userId === req.body.userId) {
            await Posts.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.status(200).json('Your Post has been updated..!')
        } else {
            res.status(403).json('You Can Only Update Your Posts...!')
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router

//DELETE THE POST
router.delete('/:id', async (req, res) => {
    try {
        const findPost = await Posts.findById(req.params.id)
        if (findPost.userId === req.body.userId) {
            await findPost.deleteOne()
            res.status(200).json('Your Post Was Deleted...!')
        } else {
            res.status(403).json('You Can Only Delete Your Post...!')
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

//LIKE AND DISLIKE THE POST

router.put('/:id/like', async (req, res) => {
    try {
        const findPost = await Posts.findById(req.params.id)
        if (!findPost.likes.includes(req.body.userId)) {
            await findPost.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json('Your are like the post')
        } else {
            await findPost.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("Your dislike the post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})


//GET THE POST

router.get('/:id', async (req, res) => {
    try {
        const findPost = await Posts.findById(req.params.id)
        res.status(200).json(findPost)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL THE POST 

router.get("/timeline/all", async (req, res) => {
    try {
        const findUser = await Users.findById(req.body.userId)
        const UserPosts = await Posts.find({ userId: findUser._id })
        const userAndFollowerPost = await Promise.all(
            findUser.followers.map((friendId) => {
               return  Posts.find({userId:friendId})
            }
            ))
        res.status(200).json(UserPosts.concat(...userAndFollowerPost))
    } catch (err) {
        res.status(500).json(err)
    }
})




