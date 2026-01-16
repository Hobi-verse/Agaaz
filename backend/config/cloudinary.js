// Cloudinary Configuration - Cloud image storage setup
const cloudinary = require('cloudinary').v2;

const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        // Verify credentials are loaded (don't log sensitive info)
        if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
            console.log('Cloudinary Connected');
        } else {
            console.error('Cloudinary Error: Missing credentials in .env file');
        }
    } catch (error) {
        console.error('Cloudinary Connection Error:', error.message);
    }
};

module.exports = { cloudinaryConnect, cloudinary };
