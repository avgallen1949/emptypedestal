// File: cloud-storage.js
// Create this as a separate file in your project root

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Upload file to S3
const uploadToS3 = async (file) => {
  const fileExtension = path.extname(file.originalname);
  const key = `uploads/${uuidv4()}${fileExtension}`;
  
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  try {
    const data = await s3.upload(params).promise();
    return {
      url: data.Location,
      key: data.Key
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

// Delete file from S3
const deleteFromS3 = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  
  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw error;
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3
};