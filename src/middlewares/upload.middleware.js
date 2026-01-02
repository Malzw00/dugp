const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const { v4: uuidv4 } = require("uuid");

const UPLOAD_ROOT = path.resolve("uploads");

// تأكد من وجود المجلد الرئيسي
if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

// تحسين دليل الوجهة
const getDestination = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const folder = path.join(UPLOAD_ROOT, `${year}-${month}-${day}`);
    
    fs.mkdirSync(folder, { recursive: true });
    return folder;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getDestination());
    },

    filename: (req, file, cb) => {
        // معالجة الأسماء العربية
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const ext = path.extname(originalName).toLowerCase();
        const nameWithoutExt = path.basename(originalName, ext);
        
        // إزالة المسافات والأحرف الخاصة
        const cleanName = nameWithoutExt
            .replace(/[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 100); // تحديد طول الاسم
        
        const storedName = `${cleanName}-${Date.now()}${ext}`;
        cb(null, storedName);
    }
});

// توسيع الأنواع المسموحة
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        // صور
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
        // مستندات
        "application/pdf", 
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // عروض
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        // جداول
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // أرشيف
        "application/zip", "application/x-rar-compressed", "application/x-7z-compressed",
        // نصوص
        "text/plain", "text/html", "text/css", "application/json"
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        const error = new Error(`File type ${file.mimetype} not allowed`);
        error.status = 400;
        return cb(error, false);
    }
    
    cb(null, true);
};

const multerUpload = multer({
    storage,
    limits: { 
        fileSize: 1024 * 1024 * 100, // 100MB max (تعديل من 1GB)
        files: 1 // ملف واحد فقط
    },
    fileFilter
});

// Middleware محسّن
const upload = (req, res, next) => {
    multerUpload.single("file")(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: "File size exceeds the 100MB limit"
                });
            }
            return next(err);
        }
        next();
    });
};

module.exports = {
    upload,
    UPLOAD_ROOT
};