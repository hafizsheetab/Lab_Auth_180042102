require('dotenv').config()
const connectDB = require('./config/db')
const express = require('express')
const app = express()
const PORT = process.env.PORT
const User = require('./Models/User')
connectDB()
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))
app.use(express.json({extende: false}))
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {registrationValidation, loginValidation} = require('./validation')


app.get('/login', (req, res) => {
    res.sendFile('login.html',{root: './'})
})
app.post('/login', async (req, res) => {
    try{
        const {error}= loginValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        let {email, password} = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({errors:{message: 'Invalid Credentials'}})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({errors:{message: 'Invalid Credentials'}})
        }
        const payload = {
            name: user.name,
            email: user.email
        }
        jwt.sign(payload,process.env.JWT_KEY,{expiresIn:360000},(err,token) =>{
            if(err) throw err
            res.cookie('x-auth-token',token)
        })
        res.redirect('/home')
        

   }
   catch(error){
       console.error(error)
       res.status(500).send('Server Error')
   }
    
})


app.get('/register', (req,res) => {
    res.sendFile('register.html', {root: './'})
})


app.get('/home',  (req,res) => {
    res.sendFile('index.html', {root: './'})
})


app.post('/register', async(req, res) => {
    try{
        const {error}= registrationValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        let {name, email, password} = req.body
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({errors:{message: 'Already Registered'}})
        }
        const salt = await bcrypt.genSaltSync(10);
        password = await bcrypt.hash(password,salt)
        user = new User({
            name, 
            email,
            password
        }
        )
        await user.save()
        const payload = {
            name: user.name,
            email: user.email
        }
        jwt.sign(payload,process.env.JWT_KEY,{expiresIn:360000},(err,token) =>{
            if(err) throw err
            res.cookie('x-auth-token',token)
        })
        res.redirect('/home')

    }
    catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))