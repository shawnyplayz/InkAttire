const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    cloud_name: 'dip2pjbju', 
    api_key: '243184817478383', 
    api_secret: 'ns-gVepWEmHtaGr00_Zfd4XTXzA' 
  }); 
  module.exports = cloudinary;