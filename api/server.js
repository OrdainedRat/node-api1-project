// BUILD YOUR SERVER HERE
const express = require('express')
const res = require('express/lib/response')
const User = require('./users/model.js')

const server = express()

server.use(express.json())

//Endpoints

server.get('/api/users', async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

server.get('/api/users/:id', async (req, res) => {
    console.log('method', req.method)
    console.log('headers', req.headers)
    console.log('body', req.body)
    console.log('params', req.params)
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if(!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            res.status(200).json(user)
        }
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

server.post('/api/users', async (req, res) => {
const { name, bio } = req.body
console.log('herrrre', req.body)
  if (!name || !bio) {
      res.status(400).json({
          message: "Please provide name and bio for the user"
      })
  } else {
      try{
        const newUser = await User.insert({name, bio})
        res.status(201).json(newUser)
      } catch(err) {
          res.status(500).json({
              message: "There was an error while saving the user to the database",
              error: err.message
          })
      }
  }
})

server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const { name, bio } = req.body
    const selectedUser = await User.findById(id)
    try{
        if(!selectedUser) {
            res.status(404).json({ message:"The user with the specified ID does not exist" })
        } else if(!name || !bio ) {
            res.status(400).json({ message:"Please provide name and bio for the user" })
        } else {
           const updatedUser = await User.update(id, {name, bio})
           res.status(200).json(updatedUser)
        }
    } catch(err) {
        res.status(500).json({
            message: "The user information could not be modified",
            error: err.message 
        })
    }
})

server.delete('/api/users/:id', async (req, res) =>{
    const { id } = req.params
    const selectedUser = await User.findById(id)
    try{
        if(!selectedUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            const deleteIt = await User.remove(id)
            res.status(200).json(deleteIt)
        }
    } catch(err) {
        res.status(500).json({
            message: "The user could not be removed" 
        })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
