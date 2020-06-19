const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../config/auth')
const Task = require('../models/Task')
router.get('/', (req, res) => res.render('welcome'))


router.get('/tasks', ensureAuth, (req, res) => {
    Task.find({owner: req.user._id}, (err, tasks) => {
        res.render('tasks', { title: 'Tasks', tasks })
    })
})
router.post('/tasks', ensureAuth, (req, res) => {
    const newTask = new Task({ task: req.body.task, owner: req.user._id })
    newTask.save()
    res.send(newTask)
})

router.get('/tasks/delete/:id', ensureAuth, (req, res) => {
    Task.findByIdAndRemove(req.params.id, (err, post) => {
        if (err){
            res.send(err)  
        } else {
            res.send('Successfully deleted')
        }
        
    })
})
module.exports = router