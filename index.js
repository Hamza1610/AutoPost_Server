const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user')
const multer = require('multer')
const DbUrl = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
const {LinkeIn_Uploader, Facebook_Uploader, Twitter_X_Uploader} = require('./controllers/uploaders');
const { log } = require('console');
const app = express();

const storage = multer.memoryStorage(); // Use memory storage for the image
const upload = multer({ storage });

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


app.post('/api/post', upload.array('images', 10), (req, res) => {
  const user = req.body.user;
  const message = req.body.message;
  const postedImages = req.files;

  try {
    // Your code for processing and posting data
    // Process and post the text and image files to social media platforms here
    User.findOne({ UserName: user })
    .then((result) => {

      // Log the file information
      if (postedImages && postedImages.length > 0) {
        console.log('Uploaded files:');
        postedImages.forEach((file, index) => {
          console.log('Line 68');
        const tempPath = path.join(__dirname, 'temp-uploads', file.originalname);
        console.log('Line 70');     
        // Create a temporary file from the in-memory data
        fs.writeFileSync(tempPath, file.buffer);
      
        // Log the temporary file path
        console.log(`File ${index + 1} path:`, tempPath);
      
        // Now you can pass `tempPath` to your upload function
        Facebook_Uploader(result.Facebook_Token, message, tempPath);
      console.log('Wanting to test');
        // Optionally, remove the temporary file after use
        // fs.unlinkSync(tempPath);
        });
      }

    })
    .catch((err) => {
      res.json({ error: err})
    });

  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

