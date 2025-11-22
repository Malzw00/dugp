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
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = path.join(UPLOAD_ROOT, new Date().toISOString().slice(0, 10));
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const storedName = `${Date.now()}-${uuidv4()}${ext}`;
        cb(null, storedName);
    }
});

/**
 * Multer instance (ORIGINAL)
 */
const multerUpload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max
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

/**
 * Safe wrapper so Multer errors go to global error handler
 */
const upload = (req, res, next) => {
    multerUpload.single("file")(req, res, (err) => {
        if (err) return next(err);
        next();
    });
};

module.exports = {
    upload,
    UPLOAD_ROOT
};
