const FileService = require("@services/File.service");

/**
 * @controller fileController
 * @description Handles file CRUD operations and upload functionality.
 */
const fileController = {

    /**
     * Get all files with optional pagination.
     *
     * @route GET /files
     * @access Authenticated users only
     * 
     * @param {import("express").Request} req - Express request object with optional query params: `limit` and `offset`.
     * @param {import("express").Response} res - Express response object
     */
    async getAll(req, res) {
        try {
            const { limit, offset } = req.query;

            const limitNum = parseInt(limit);
            const offsetNum = parseInt(offset);

            const files = await FileService.getAll({ 
                offset: offsetNum,   
                limit: limitNum,
            });

            if (!files) {
                res.status(404).json({ success: false });
                return;
            }

            res.status(200).json({
                success: true,
                result: files,
            });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Get a file by its ID.
     *
     * @route GET /files/:fileId
     * @access Authenticated users only
     * 
     * @param {import("express").Request} req - Express request object with `params.fileId`.
     * @param {import("express").Response} res - Express response object
     */
    async getByID(req, res) {
        try {
            const { fileId } = req.params;
            const fileIdNum = parseInt(fileId);

            const file = await FileService.getFileById(fileIdNum);

            if (!file) {
                res.status(404).json({ success: false });
                return;
            }

            res.status(200).json({
                success: true,
                result: file,
            });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Delete a file by its ID.
     *
     * @route DELETE /files/:fileId
     * @access Authenticated users only
     * 
     * @param {import("express").Request} req - Express request object with `params.fileId`.
     * @param {import("express").Response} res - Express response object
     */
    async deleteByID(req, res) {
        try {
            const { fileId } = req.params;
            const fileIdNum = parseInt(fileId);

            const deleted = await FileService.deleteFile(fileIdNum);

            if (!deleted) {
                res.status(404).json({ success: false });
                return;
            }

            res.status(200).json({ success: true });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Upload a single file and save its metadata to the database.
     *
     * @route POST /files
     * @access Authenticated users only
     * 
     * @param {import("express").Request} req - Express request object containing the uploaded file in `req.file` and optional `category` in `req.body`.
     * @param {import("express").Response} res - Express response object
     */
    async uploadFile(req, res) {
        try {
            const file = req.file;
            const { category } = req.body;
            const { accountID } = req.user; // UUID of uploader

            if (!file) {
                return res.status(400).json({ success: false });
            }

            const uploaded = await FileService.uploadFile({
                filePath: file.path,
                originalName: file.originalname,
                mimeType: file.mimetype,
                category,
                uploaderId: accountID,
            });

            if (!uploaded) {
                return res.status(400).json({ success: false });
            }

            res.status(200).json({
                success: true,
                result: uploaded,
            });

        } catch {
            res.status(500).json({ success: false });
        }
    },
};

module.exports = fileController;