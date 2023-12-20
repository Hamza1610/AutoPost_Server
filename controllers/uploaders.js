const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { isArray } = require('util');

const postOnFacebook = async (accessToken, message, postedImages) => {
  console.log('------------------------------Facebook Uploader test-----------------------------------');
  console.log('Access Token:', accessToken, '\n' + '\n');
  console.log('Message:', message, '\n' + '\n');
  console.log('Images:', postedImages);

  try {
    // Iterate over each posted image
    await Promise.all(postedImages.map(async (image) => {
      try {
        if (typeof image === 'string') { // Check if the image is a string (file path)
          const form = new FormData();
          form.append('caption', message);
          form.append('source', fs.createReadStream(image));

          console.log('Testing');

          // Post image to Facebook
          const response = await axios.post('https://graph.facebook.com/v13.0/me/photos?access_token=' + accessToken, form, {
            headers: form.getHeaders(),
          });

          console.log('Posted to Facebook:', response.data);
        } else {
          console.error('Invalid image path:', image);
        }
      } catch (error) {
        console.error('Error posting to Facebook:', error);
      }
    }));
  } catch (error) {
    console.error('Facebook Uploader Error:', error);
  }
};




const postOnTwitter = async (accessToken, message, postedImages) => {
  console.log('Twitter Uploader test');
  console.log('Access Token:', accessToken);
  console.log('Message:', message);
  console.log('Images:', postedImages);

  try {
    // Upload each image
    const mediaIds = await Promise.all(postedImages.map(uploadImage));

    const status = `${message}\n${mediaIds.map(id => `media_ids=${id}`).join('&')}`;

    // Post status to Twitter
    const response = await axios.post('https://api.twitter.com/1.1/statuses/update.json', `status=${encodeURIComponent(status)}`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });

    console.log('Posted to Twitter:', response.data);

  } catch (error) {
    console.error('Twitter Uploader Error:', error);
  }

  async function uploadImage(image) {
    try {
      const formData = new FormData();
      formData.append('media', image.buffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });

      const response = await axios.post('https://upload.twitter.com/1.1/media/upload.json', formData, {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          ...formData.getHeaders(),
        },
      });

      return response.data.media_id_string;
    } catch (error) {
      console.error('Error uploading image to Twitter:', error);
      throw error; // rethrow the error to be caught by Promise.all
    }
  }
};


const postOnLinkedIn = (accessToken, message, postedImages) => {
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
  postOnFacebook,
  postOnTwitter,
  postOnLinkedIn,
};