const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { isArray } = require('util');

const Facebook_Uploader = (accessToken, message, postedImages) => {
  console.log('------------------------------Facebook Uploader test-----------------------------------');
  console.log('Access Token:', accessToken, '\n' + '\n');
  console.log('Message:', message,  '\n' + '\n');
  console.log('Images:', postedImages);
  try {
    postedImages.forEach((image) => { 
      const form = new FormData();
      form.append('caption', message); 
      form.append('source', fs.createReadStream(image));
      console.log('Testing');
      axios.post('https://graph.facebook.com/v13.0/me/photos?access_token=' + accessToken, form, {
        headers: form.getHeaders(),
      })
      .then(response => {
        console.log('Posted to Facebook:', response.data);
      })
      .catch(error => {
        console.error('Error posting to Facebook:', error);
      });

    });
  } catch (error) {
    console.error('Facebook Uploader Error:', error);
  }
};


const Twitter_X_Uploader = (accessToken, message, postedImages) => {
  console.log('Twitter Uploader test');
  console.log('Access Token:', accessToken);
  console.log('Message:', message);
  console.log('Images:', postedImages);

  try {
    const mediaIds = [];

    // Upload each image
    Promise.all(postedImages.map(uploadImage))
      .then((mediaIds) => {
        const status = `${message}\n${mediaIds.map(id => `media_ids=${id}`).join('&')}`;

        axios.post('https://api.twitter.com/1.1/statuses/update.json', `status=${encodeURIComponent(status)}`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken,
          },
        })
          .then(response => {
            console.log('Posted to Twitter:', response.data);
          })
          .catch(error => {
            console.error('Error posting to Twitter:', error);
          });
      })
      .catch(error => {
        console.error('Error uploading image to Twitter:', error);
      });

    function uploadImage(imagePath) {
      const formData = new FormData();
      formData.append('media', fs.createReadStream(imagePath));

      return axios.post('https://upload.twitter.com/1.1/media/upload.json', formData, {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          ...formData.getHeaders(),
        },
      })
        .then(response => {
          return response.data.media_id_string;
        });
    }
  } catch (error) {
    console.error('Twitter Uploader Error:', error);
  }
};


const LinkeIn_Uploader = (accessToken, message, postedImages) => {
  console.log('LinkedIn Uploader test');
  console.log('Access Token:', accessToken);
  console.log('Message:', message);
  console.log('Images:', postedImages);

  try {
    const formData = new FormData();
    formData.append('author', 'urn:li:person:YOUR_LINKEDIN_MEMBER_ID');
    formData.append('lifecycleState', 'PUBLISHED');
    formData.append('specificContent.title', 'Your post title');
    formData.append('specificContent.description', message);
    formData.append('specificContent.shareMediaCategory', 'IMAGE');
    formData.append('specificContent.shareMedia.media', postedImages);

    axios.post('https://api.linkedin.com/v2/ugcPosts', formData, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        ...formData.getHeaders(),
      },
    })
      .then(response => {
        console.log('Posted to LinkedIn:', response.data);
      })
      .catch(error => {
        console.error('Error posting to LinkedIn:', error);
      });
  } catch (error) {
    console.error('LinkedIn Uploader Error:', error);
  }
};

module.exports = {
  Facebook_Uploader,
  Twitter_X_Uploader,
  LinkeIn_Uploader,
};