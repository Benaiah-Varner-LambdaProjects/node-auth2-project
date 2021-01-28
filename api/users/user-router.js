const router = require('express').Router()
const Users = require('./user-model')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../auth/secrets')
const bcryptjs = require('bcryptjs')

router.get('/', (req, res) => {
    Users.get()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json(err.message)
    })
})

router.post('/register', (req, res) => {
const credentials = req.body

    const hash = bcryptjs.hashSync(credentials.password, 10);
    credentials.password = hash

    Users.add(credentials)
    .then(newUser => {
        console.log(newUser)
        res.status(210).json(newUser)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err.message)
    })  
})

router.post('/login', (req, res) => {
    const { name, password } = req.body
    console.log('body ', req.body)
    Users.findBy({ name: name })
    .then(([user]) => {
        console.log(user)
        if (user && bcryptjs.compareSync(password, user.password)) {
            const token = generateToken(user)
            res.status(200).json({ message: "succesfully logged in", token })
        } else {
            res.status(401).json({ message: 'incorrect username or password' })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err.message)
    })
})

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.name,
        department: user.department
    }

    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;