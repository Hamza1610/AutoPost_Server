const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user')
const multer = require('multer')
const {postOnFacebook, postOnTwitter, postOnLinkedIn} = require('./controllers/uploaders');
const app = express();

const storage = multer.memoryStorage(); // Use memory storage for the image
const upload = multer({ storage });

// mongoose.connect(DbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((result) => app.listen(4000, ()=> console.log('Serveer running on port 4000!')))
//     .catch((err) => console.log(err));

// Middlewares
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


// index.js

// ... (previous code)

app.post('/api/post', upload.array('images', 10), async (req, res) => {
  const message = req.body.message;
  const postedImages = req.files;


  try {
    // Loop through each posted image
    for (let index = 0; index < postedImages.length; index++) {
      const file = postedImages[index];

      // Assuming 'tempPath' is the temporary file path for each image
      const tempPath = path.join(__dirname, 'temp-uploads', file.originalname);

      // Create a temporary file from the in-memory data
      fs.writeFileSync(tempPath, file.buffer);

      // Log the temporary file path
      console.log(`File ${index + 1} path:`, tempPath);

      // Post on Twitter
      await postOnLinkedIn('EAAMcmjzJZCGwBO1l25Ne7dq7g7bIbVKh2GfLSPvZC6ZAhUqYPGQYuZBJMtO6zY8SNQCeXh8hsDua5qUlAE1ZCWhCT1Yx8yqNwDpcjEFvQesUGuomZCc3feeGu4tJwYz5sKfXLqoTZB0m2eiMWA6zdQhNiRLsIizhvBcZBMCvJVQ7Xl9JL0raindE7NkZAuC4OL7paVPfsTldOsey1u1zCKXTS0z3ZCAhGYXNgZBlfoXGZCMyHUns4ZBrF1gZCklj0O5WOo2QZDZD', message, req.files)
      .then((response) => { 
        console.log('Response :', response);
      })
      .catch((error) => {
        console.log('Error:', error);
      }
      )

      // Optionally, remove the temporary file after use
      fs.unlinkSync(tempPath);
    }

    // Additional code for processing and posting data

    res.status(200).json({ message: 'Content posted successfully on social media.' });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (remaining code)

app.listen(4000, () => {
  console.log('Server conected Successfully! ');
})