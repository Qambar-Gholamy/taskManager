require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
        cloud_name: 'degmttaep', 
        api_key: '376574195956526', 
        api_secret: 'PY5B5F2v1SgbZiCGJ_F7FsIIXVs'
    });
module.exports = { cloudinary };