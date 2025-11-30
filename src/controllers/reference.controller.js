/**
 * @file reference.controller.js
 * @description Controller handling CRUD operations for project references.
 */

const ReferenceService = require("@services/project/reference.service");

/**
 * @controller referenceController
 * @description Handles CRUD logic for project references.
 */
const referenceController = {

    /**
     * Create a new reference entry.
     *
     * @async
     * @param {import("express").Request} req - Express Request object.
     * @param {import("express").Response} res - Express Response object.
     * 
     * @body {string} title - Reference title.
     * @body {string} link - Reference link.
     * @body {string} [author] - Author name.
     * 
     * @returns {Promise<void>} JSON response containing created reference.
     */
    async create(req, res) {
        try {
            const { title, link, author } = req.body;

            const created = await ReferenceService.create({ 
                title, link, author
            });

            if (!created) {
                res.status(404).json({ success: false });
                return;
            }

            res.status(201).json({
                success: true,
                result: created,
            });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Retrieve all references with pagination.
     *
     * @async
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * 
     * @query {number} [offset] - Pagination starting index.
     * @query {number} [limit] - Number of records to return.
     * 
     * @returns {Promise<void>} JSON response with list of references.
     */
    async getAll(req, res) {
        try {
            const { limit, offset } = req.query;

            const limitNum = parseInt(limit);
            const offsetNum = parseInt(offset);

            const references = await ReferenceService.getReferences({ 
                offset: offsetNum,   
                limit: limitNum,
            });

            if (!references) {
                res.status(404).json({ success: false });
                return;
            }

            res.status(200).json({
                success: true,
                result: references,
            });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Retrieve a single reference by ID.
     *
     * @async
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * 
     * @param {number} referenceId - ID of the reference to retrieve.
     * 
     * @returns {Promise<void>} JSON response with reference data.
     */
    async getByID(req, res) {
        try {
            const { referenceId } = req.params;
            const referenceIdNum = parseInt(referenceId);

            const reference = await ReferenceService.getReferenceByID({ reference_id: referenceIdNum });

            if (!reference) {
                res.status(404).json({ success: false });
                return;
            }

            res.status(200).json({
                success: true,
                result: reference,
            });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Delete a reference by ID.
     *
     * @async
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * 
     * @param {number} referenceId - ID of the reference to delete.
     * 
     * @returns {Promise<void>} JSON response indicating success or failure.
     */
    async deleteByID(req, res) {
        try {
            const { referenceId } = req.params;
            const referenceIdNum = parseInt(referenceId);

            const deleted = await ReferenceService.delete({ reference_id: referenceIdNum });

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
     * Update a reference entry by ID.
     *
     * @async
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * 
     * @body {string} [title] - Updated title.
     * @body {string} [link] - Updated link.
     * @body {string} [author] - Updated author name.
     * 
     * @returns {Promise<void>} JSON response containing updated reference.
     */
    async update(req, res) {
        try {
            const { referenceId } = req.params;
            const { title, link, author } = req.body;
            const referenceIdNum = parseInt(referenceId);

            const updated = await ReferenceService.update({ 
                reference_id: referenceIdNum,
                title,
                link,
                author
            });

            if (!updated) {
                res.status(404).json({ success: false });
                return;
            }

            res.status(200).json({
                success: true,
                result: updated,
            });

        } catch {
            res.status(500).json({ success: false });
        }
    },
};

module.exports = referenceController;