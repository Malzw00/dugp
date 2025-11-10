/**
 * @file project.controller.js
 * @description Controller layer for handling HTTP requests related to graduation projects.
 * It provides CRUD endpoints (Create, Read, Update, Delete) for managing project records
 * through the ProjectService layer.
 */

const ProjectService = require("@services/project/project.service");

const projectController = {

    /**
     * @function getAll
     * @description Fetch all projects with optional pagination, ordering, and filtering.
     * @route GET /api/projects
     * 
     * @param {import('express').Request} req - Express request object containing query params:
     *  - {number} offset - Starting index for pagination.
     *  - {number} limit - Maximum number of records to fetch.
     *  - {string} orderBy - Field name to order by.
     *  - {string} orderDir - Direction: ASC or DESC.
     *  - {string} categoryIds - Comma-separated list of category IDs.
     *  - {number} departmentId - Filter by department.
     *  - {number} collageId - Filter by collage.
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {JSON} 200 - List of matching projects.
     * @returns {JSON} 500 - Internal server error.
     */
    async getAll(req, res) {
        try {
            const { offset, limit, orderBy, orderDir, categoryIds, departmentId, collageId } = req.query;

            const offsetNum = parseInt(offset) || 0;
            const limitNum = parseInt(limit) || 20;
            const orderByField = orderBy || 'created_at';
            const orderDirVal = orderDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            const categoryIdsArray = categoryIds ? categoryIds.split(',').map(Number) : [];

            const projects = await ProjectService.getAll({
                offset: offsetNum,
                limit: limitNum,
                order: { by: orderByField, dir: orderDirVal },
                filters: {
                    category_ids: categoryIdsArray,
                    collage_id: collageId ? Number(collageId) : undefined,
                    department_id: departmentId ? Number(departmentId) : undefined,
                },
            });

            res.status(200).json({
                success: true,
                result: projects,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Get All Projects Failed.',
                error: error.message,
            });
        }
    },


    /**
     * @function getByID
     * @description Retrieve a single project by its unique ID.
     * @route GET /api/projects/:projectId
     * 
     * @param {import('express').Request} req - Express request with path param `projectId`.
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {JSON} 200 - Project object.
     * @returns {JSON} 400 - Invalid ID provided.
     * @returns {JSON} 404 - Project not found.
     * @returns {JSON} 500 - Internal server error.
     */
    async getByID(req, res) {
        try {
            const { projectId } = req.params;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const project = await ProjectService.get({ project_id: projectIdNum });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "Project Not Found.",
                });
            }

            res.status(200).json({
                success: true,
                result: project,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Get Project Failed.",
                error: error.message,
            });
        }
    },


    /**
     * @function create
     * @description Create a new project record.
     * @route POST /api/projects
     * 
     * @param {import('express').Request} req - Express request containing project data in the body:
     *  - {string} title - Project title.
     *  - {string} description - Description of the project.
     *  - {string} date - Project creation or submission date.
     *  - {string} semester - Academic semester (e.g., "Fall 2025").
     *  - {number} departmentId - Department ID.
     *  - {number} supervisorId - Supervisor ID.
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {JSON} 201 - Successfully created project.
     * @returns {JSON} 400 - Missing or invalid parameters.
     * @returns {JSON} 500 - Internal server error.
     */
    async create(req, res) {
        try {
            const { title, description, date, semester, departmentId, supervisorId } = req.body;

            if (!title || !departmentId || !supervisorId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: title, departmentId, or supervisorId.",
                });
            }

            const departmentIdNum = parseInt(departmentId);
            const supervisorIdNum = parseInt(supervisorId);

            if (isNaN(departmentIdNum) || isNaN(supervisorIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid departmentId or supervisorId.",
                });
            }

            const project = await ProjectService.create({
                title,
                description,
                date,
                semester,
                department_id: departmentIdNum,
                supervisor_id: supervisorIdNum,
            });

            res.status(201).json({
                success: true,
                message: "Project created successfully.",
                result: project,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create project.",
                error: error.message,
            });
        }
    },


    /**
     * @function update
     * @description Update an existing project by ID.
     * @route PUT /api/projects/:projectId
     * 
     * @param {import('express').Request} req - Express request object containing:
     *  - Path param `projectId`
     *  - Body fields to update (title, description, semester, etc.)
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {JSON} 200 - Successfully updated.
     * @returns {JSON} 400 - Invalid ID or bad request.
     * @returns {JSON} 404 - Project not found.
     * @returns {JSON} 500 - Internal server error.
     */
    async update(req, res) {
        try {
            const { projectId } = req.params;
            const { 
                title, 
                description, 
                date, 
                semester, 
                grade, 
                departmentId, 
                imageId, 
                supervisorId, 
                available 
            } = req.body;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const gradeVal = grade ? parseInt(grade) : undefined;
            const departmentIdNum = departmentId ? parseInt(departmentId) : undefined;
            const coverImageIdNum = imageId ? parseInt(imageId) : undefined;
            const supervisorIdNum = supervisorId ? parseInt(supervisorId) : undefined;
            const availableVal = available === true || available === "true";

            const updatedRows = await ProjectService.update({
                project_id: projectIdNum,
                title,
                description,
                semester,
                date,
                grade: gradeVal,
                cover_image_id: coverImageIdNum,
                department_id: departmentIdNum,
                supervisor_id: supervisorIdNum,
                available: availableVal,
            });

            if (!updatedRows) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found or no changes applied.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Project updated successfully.",
                updatedRows,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update project.",
                error: error.message,
            });
        }
    },


    /**
     * @function delete
     * @description Delete a project by its ID.
     * @route DELETE /api/projects/:projectId
     * 
     * @param {import('express').Request} req - Express request with path param `projectId`.
     * @param {import('express').Response} res - Express response object.
     * 
     * @returns {JSON} 204 - Successfully deleted (no content).
     * @returns {JSON} 400 - Invalid ID format.
     * @returns {JSON} 404 - Project not found.
     * @returns {JSON} 500 - Internal server error.
     */
    async delete(req, res) {
        try {
            const { projectId } = req.params;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const deleted = await ProjectService.delete({ project_id: projectIdNum });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found.",
                });
            }

            res.status(204).json({
                success: true,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete project.",
                error: error.message,
            });
        }
    },

};

module.exports = projectController;