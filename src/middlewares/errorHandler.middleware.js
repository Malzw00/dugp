// errorHandler.middleware.js
module.exports = function ErrorHandler(err, req, res, next) {

    console.error("🔥 Global Error:", err);

    // Multer errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }

    // Custom known errors
    if (err.status && err.message) {
        return res.status(err.status).json({
            success: false,
            message: err.message
        });
    }

    // Fallback — unknown errors
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        // error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};