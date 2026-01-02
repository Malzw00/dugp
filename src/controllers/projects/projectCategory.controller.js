/**
 * @file projectCategory.controller.js
 * @description Controller for handling operations related to Project–Category associations.
 * Provides endpoints for retrieving, adding, and removing categories assigned to a project.
 * 
 * @module Controllers/ProjectCategoryController
 */

const ProjectCategoryService = require("@services/project/projectCategory.service");

const projectCategoryController = {

    /**
     * Retrieve all categories linked to a specific project.
     * 
     * @async
     * @function getAll
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {Promise<void>} JSON response with project categories.
     * 
     * @example
     * GET /api/projects/5/categories
     * 
     * Response:
     * {
     *   "success": true,
     *   "result": [
     *     { "category_id": 1, "name": "AI" },
     *     { "category_id": 3, "name": "Software Engineering" }
     *   ]
     * }
     */
    async getAll(req, res) {
        try {
            const { projectId } = req.query;

            const projectIdNum = parseInt(projectId);

            console.log(projectIdNum)

            // Fetch project categories using the service layer
            const projectCategories = await ProjectCategoryService.Project.getCategories({
                project_id: projectIdNum,
            });

            // Return success response
            res.status(200).json({
                success: true,
                result: projectCategories.filter(pc => pc !== null),
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project categories.",
                
            });
        }
    },


    /**
     * Add one or more categories to a specific project.
     * 
     * @async
     * @function add
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {Promise<void>} Responds with success status upon successful insertion.
     * 
     * @example
     * POST /api/projects/5/categories
     * Body:
     * {
     *   "categoryIds": [1, 2, 3]
     * }
     * 
     * Response:
     * {
     *   "success": true,
     *   "message": "Categories added to project successfully."
     * }
     */
    async add(req, res) {
        try {
            const { projectId, categoryId } = req.body;

            const categoryIdNum = parseInt(categoryId);
            const projectIdNum = parseInt(projectId);

            // Call service layer
            await ProjectCategoryService.Project.addToCategories({
                project_id: projectIdNum,
                category_ids: [categoryIdNum],
            });

            // Respond with 201 Created
            res.status(201).json({
                success: true,
                message: "Categories added to project successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to add categories to project.",
                
            });
        }
    },


    /**
     * Remove a specific category from a project.
     * 
     * @async
     * @function remove
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {Promise<void>} Responds with a success message upon successful deletion.
     * 
     * @example
     * DELETE /api/projects/5/categories/3
     * 
     * Response:
     * {
     *   "success": true
     * }
     */
    async remove(req, res) {
        try {
            const { projectId, categoryId } = req.query;

            const projectIdNum = parseInt(projectId);
            const categoryIdNum = parseInt(categoryId);

            // Remove category from project
            await ProjectCategoryService.Project.removeFromCategories({
                project_id: projectIdNum,
                category_ids: [categoryIdNum],
            });

            // Return success (200 OK)
            res.status(200).json({
                success: true,
                message: "Category removed from project successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove category from project.",
                
            });
        }
    },
};


module.exports = projectCategoryController;