// FileService.js
const { models, sequelize } = require("@config/database.config");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");


class FileService {
    static #logger = new ServiceErrorLogger({ module: "FileService" });

    /**
     * Upload a new file and save its record in DB
     * @param {Object} params
     * @param {string} params.filePath - Full path of the file on disk
     * @param {string} params.originalName - Original filename
     * @param {string} params.mimeType - File MIME type
     * @param {string} params.category - File category ('book', 'presentation', 'image', 'reference')
     * @param {string} params.uploaderId - UUID of the uploader account
     * @returns {Promise<Object>} File record
     */
    static async uploadFile({ filePath, originalName, mimeType, category, uploaderId }) {
        try {
            const buffer = fs.readFileSync(filePath);
            const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

            const existing = await models.File.findOne({ where: { file_hash: fileHash } });
            if (existing) return { message: "File already exists", file: existing };

            const stats = fs.statSync(filePath);
            const storedName = path.basename(filePath);
            const relativePath = path.dirname(filePath).replace(process.cwd(), "");

            return await models.File.create({
                original_name: originalName,
                stored_name: storedName,
                path: relativePath,
                mime_type: mimeType,
                category,
                size: stats.size,
                file_hash: fileHash,
                uploader_id: uploaderId,
            });
        } catch (error) {
            throw this.#logger.log(this.uploadFile.name, error);
        }
    }

    /**
     * Get file by ID
     * @param {number} fileId 
     * @returns {Promise<Object|null>}
     */
    static async getFileById(fileId) {
        try {
            return await models.File.findByPk(fileId);
        } catch (error) {
            throw this.#logger.log(this.getFileById.name, error);
        }
    }

    /**
     * Delete a file from disk and DB
     * @param {number} fileId 
     * @returns {Promise<boolean|null>} Returns true if deleted, null if file not found
     */
    static async deleteFile(fileId, { transaction }) {
        const ownTransaction = !transaction;
        const _transaction   = transaction?? await sequelize.transaction();
        try {
            const file = await models.File.findByPk(fileId);
            if (!file) return null;

            const fullPath = path.join(process.cwd(), file.path, file.stored_name);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

            await file.destroy({ transaction: _transaction });

            if(ownTransaction) await _transaction.commit();

            return true;

        } catch (error) {
            if(ownTransaction) await _transaction.rollback();
            throw this.#logger.log(this.deleteFile.name, error);
        }
    }

    /**
     * Get all files uploaded by a specific user
     * @param {string} uploaderId 
     * @returns {Promise<Array>}
     */
    static async getFilesByUploader(uploaderId) {
        try {
            return await models.File.findAll({ where: { uploader_id: uploaderId } });
        } catch (error) {
            throw this.#logger.log(this.getFilesByUploader.name, error);
        }
    }

    /**
     * Update file metadata (name, category, etc.)
     * @param {number} fileId - ID of the file to update
     * @param {Object} updates - Object containing the fields to update
     * @param {string} [updates.original_name] - New original filename
     * @param {string} [updates.stored_name] - New stored filename
     * @param {string} [updates.path] - New relative path
     * @param {string} [updates.mime_type] - New MIME type
     * @param {string} [updates.category] - New category ('book', 'presentation', 'image', 'reference')
     * @param {number} [updates.size] - New file size
     * @param {string} [updates.file_hash] - New SHA256 hash
     * @returns {Promise<Object|null>} Updated file record or null if not found
     */
    static async updateFileMetadata(fileId, updates) {
        try {
            const file = await models.File.findByPk(fileId);
            if (!file) return null;
            return await file.update(updates);
        } catch (error) {
            throw this.#logger.log(this.updateFileMetadata.name, error);
        }
    }

    /**
     * Find file by SHA256 hash
     * @param {string} fileHash 
     * @returns {Promise<Object|null>}
     */
    static async findFileByHash(fileHash) {
        try {
            return await models.File.findOne({ where: { file_hash: fileHash } });
        } catch (error) {
            throw this.#logger.log(this.findFileByHash.name, error);
        }
    }

    /**
     * Stream a file to HTTP response
     * @param {number} fileId 
     * @param {import('express').Response} res 
     */
    static async streamFile(fileId, res) {
        try {
            const file = await models.File.findByPk(fileId);
            if (!file) throw new Error("File not found");

            const fullPath = path.join(process.cwd(), file.path, file.stored_name);
            res.setHeader("Content-Type", file.mime_type);
            fs.createReadStream(fullPath).pipe(res);
        } catch (error) {
            throw this.#logger.log(this.streamFile.name, error);
        }
    }

    /**
     * Bulk delete files by array of IDs
     * @param {Array<number>} fileIds 
     * @returns {Promise<number>} Number of files deleted
     */
    static async bulkDeleteFiles(fileIds, transaction) {
        const ownTransaction = !transaction;
        const _transaction = transaction?? await sequelize.transaction();
        try {
            let count = 0;
            
            for (const id of fileIds) {
                const deleted = await this.deleteFile(id, { transaction: _transaction });
                if (deleted) count++;
            }

            if(ownTransaction) await _transaction.commit();

            return count;
        
        } catch (error) {
            if(ownTransaction) await _transaction.rollback();
            throw this.#logger.log(this.bulkDeleteFiles.name, error);
        }
    }

    /**
     * Check if file exists on disk
     * @param {number} fileId 
     * @returns {Promise<boolean>}
     */
    static async fileExists(fileId) {
        try {
            const file = await models.File.findByPk(fileId);
            if (!file) return false;
            const fullPath = path.join(process.cwd(), file.path, file.stored_name);
            return fs.existsSync(fullPath);
        } catch (error) {
            throw this.#logger.log(this.fileExists.name, error);
        }
    }
}

module.exports = FileService;