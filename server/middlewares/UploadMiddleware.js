const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only Excel files
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls') {
        return cb(new Error('Only Excel files are allowed'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;