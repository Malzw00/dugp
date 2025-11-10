/**
 * @file projectKeyword.controller.js
 * @description Controller responsible for managing the relationship between Projects and Keywords.
 * Provides endpoints to list, create, and delete keywords associated with a specific project.
 * 
 * @module Controllers/ProjectKeywordController
 */

const ProjectKeywordService = require("@services/project/projectKeyword.service");

const projectKeywordController = {

    /**
     * @async
     * @function getAll
     * @description Retrieves all keywords linked to a specific project.
     * @route GET /api/projects/:projectId/keywords
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing `projectId` in URL params.
     * @param {import("express").Response} res - Express response object used to send the JSON response.
     * 
     * @returns {Promise<void>} Returns a list of project keywords.
     * 
     * @example
     * // Example Request:
     * GET /api/projects/12/keywords
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": [
     *     { "keyword_id": 3, "keyword": "AI" },
     *     { "keyword_id": 4, "keyword": "Machine Learning" }
     *   ]
     * }
     * 
     * @throws {500} InternalServerError - If database query fails.
     */
    async getAll(req, res) {
        try {
            const { projectId } = req.params;
            const projectIdNum = parseInt(projectId);

            const projectKeywords = await ProjectKeywordService.Project.getKeywords({
                project_id: projectIdNum,
            });

            res.status(200).json({
                success: true,
                result: projectKeywords,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project keywords.",
                error: error.message,
            });
        }
    },

    /**
     * @async
     * @function create
     * @description Adds one or more keywords to a specific project.
     * @route POST /api/projects/:projectId/keywords
     * @access Admin or Editor
     * 
     * @param {import("express").Request} req - Express request object containing `projectId` in params and `keywords` array in body.
     * @param {import("express").Response} res - Express response object used to send the JSON response.
     * 
     * @returns {Promise<void>} Returns the created keyword associations.
     * 
     * @example
     * // Example Request Body:
     * {
     *   "keywords": ["Artificial Intelligence", "Deep Learning"]
     * }
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": [
     *     { "keyword_id": 10, "keyword": "Artificial Intelligence" },
     *     { "keyword_id": 11, "keyword": "Deep Learning" }
     *   ]
     * }
     * 
     * @throws {400} BadRequest - If `keywords` array is missing or invalid.
     * @throws {500} InternalServerError - If creation fails.
     */
    async create(req, res) {
        try {
            const { projectId } = req.params;
            const { keywords } = req.body;
            const projectIdNum = parseInt(projectId);

            if (!Array.isArray(keywords) || keywords.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Keywords array is required.",
                });
            }

            const created = await ProjectKeywordService.Project.addKeywords({
                keywords,
                project_id: projectIdNum,
            });

            res.status(201).json({
                success: true,
                result: created,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to add project keywords.",
                error: error.message,
            });
        }
    },

    /**
     * @async
     * @function delete
     * @description Removes a keyword association from a specific project.
     * @route DELETE /api/projects/:projectId/keywords/:keywordId
     * @access Admin or Editor
     * 
     * @param {import("express").Request} req - Express request object containing `projectId` and `keywordId` in params.
     * @param {import("express").Response} res - Express response object used to send the JSON response.
     * 
     * @returns {Promise<void>} Returns a success message upon deletion.
     * 
     * @example
     * // Example Request:
     * DELETE /api/projects/12/keywords/5
     * 
     * // Example Response:
     * {
     *   "success": true
     * }
     * 
     * @throws {404} NotFound - If the keyword association does not exist.
     * @throws {500} InternalServerError - If deletion fails.
     */
    async delete(req, res) {
        try {
            const { projectId, keywordId } = req.params;
            const projectIdNum = parseInt(projectId);
            const keywordIdNum = parseInt(keywordId);

            await ProjectKeywordService.Project.removeKeyword({
                project_id: projectIdNum,
                keyword_id: keywordIdNum,
            });

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove project keyword.",
                error: error.message,
            });
        }
    },
};

module.exports = projectKeywordController;