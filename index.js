const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user')

const DbUrl = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
const app = express();

mongoose.connect(DbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(4000, ()=> console.log('Serveer running on port 4000!')))
    .catch((err) => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// APIs
app.post('/sign-up', (req, res) => {
    
    console.log(req.body);

    const user = new User(req.body)
    user.save()
        .then((result) => {
            console.log(result);
            res.json(result)
        }).catch((err) => {
            res.json({ error: err})
        });
})

app.post('/sign-in', (req, res) => {
    console.log(req.body);

    User.findOne(req.body)
        .then((result) => {
            console.log(result) 
            // The use
            res.json(result)
        }).catch((err) => {
            console.log(err)
            res.json({ error: err })
        });
})

app.post('/post', (req, res) => {
    // Post route: the poster code should be a funtion the media key parameters are passed
    res.send('Welcome to autopost')
})
