const express = require('express')
const router = express.Router()

router.get('/login',(req,res) => {
    res.sendFile('login.html',{root: './'})
})

module.exports = router