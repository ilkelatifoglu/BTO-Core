// src/middleware/multer.js

const multer = require('multer');

// Set up storage (in memory since we'll convert to Base64)
const storage = multer.memoryStorage();

// File filter to accept only .jpg, .jpeg, .png
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
    }
};

// Initialize multer with defined storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});

module.exports = upload;
