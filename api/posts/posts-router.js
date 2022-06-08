// implement your posts router here
const express = require('express');
const Post = require('./posts-model')

const router = express.Router();

router.get('/', (req, res) => {
    Post.find(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => {
            if(!posts){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(posts)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.post('/', (req, res) => {
    const newPost = req.body
    if(!newPost.title || !newPost.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Post.insert(newPost)
            .then(({id}) => {
                return Post.findById(id)
            })
            .then(posts => {
                res.status(201).json(posts)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    }
 
})

router.put('/:id', (req, res) => {
    const updatePost = req.body
    if(!updatePost.title || !updatePost.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Post.findById(req.params.id)  
            .then(posts => {
                if(!posts){
                    res.status(404).json({ message: "The post with the specified ID does not exist" })
                } else {
                    return Post.update(req.params.id, updatePost)
                }
            })
            .then(posts => {
                if(posts) {
                    return Post.findById(req.params.id) 
                } 
            })
            .then(post => {
                res.status(200).json(post)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    }
   
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    }
        catch(err) {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        }
    } catch (err) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

module.exports = router