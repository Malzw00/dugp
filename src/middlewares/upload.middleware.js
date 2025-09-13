// upload.middleware.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * @constant {string} UPLOAD_ROOT
 * The root folder where all uploaded files will be stored.
 */
const UPLOAD_ROOT = path.resolve("uploads");

/**
 * Multer storage configuration.
 * Stores files in a date-based folder (YYYY-MM-DD) and generates unique file names.
 */
const storage = multer.diskStorage({
    /**
     * Determine the destination folder for the uploaded file.
     * @param {Express.Request} req
     * @param {Express.Multer.File} file
     * @param {function(Error|null, string)} cb
     */
    destination: (req, file, cb) => {
        const folder = path.join(UPLOAD_ROOT, new Date().toISOString().slice(0, 10));
        fs.mkdirSync(folder, { recursive: true }); // Ensure folder exists
        cb(null, folder);
    },

    /**
     * Generate a unique file name for the uploaded file.
     * @param {Express.Request} req
     * @param {Express.Multer.File} file
     * @param {function(Error|null, string)} cb
     */
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const storedName = `${Date.now()}-${uuidv4()}${ext}`;
        cb(null, storedName);
    }
});

/**
 * Multer upload middleware with file size limit and file type filter.
 */
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max size
    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "application/zip",
            "text/plain",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Invalid file type"), false);
        }
        cb(null, true);
    }
});

module.exports = { upload, UPLOAD_ROOT };
