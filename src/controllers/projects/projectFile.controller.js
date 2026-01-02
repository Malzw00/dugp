const ProjectService = require("@services/project/project.service");

/**
 * @controller projectFileController
 * @description Controller for handling project-related files such as books, presentations, and references.
 * Provides endpoints for uploading, retrieving, and deleting files associated with a project.
 */
const projectFileController = {

    /**
     * Get the book file associated with a project.
     * 
     * @route GET /projects/:projectId/book
     * @description Retrieves the book file metadata for a given project.
     * @access Protected
     */
    async getBook(req, res) {
        try {
            const { projectId } = req.query;

            const projectIdNum = parseInt(projectId);

            const book = await ProjectService.getBook({ project_id: projectIdNum });

            res.status(200).json({
                success: true,
                message: "Book retrieved successfully.",
                result: book,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project book.",
                
            });
        }
    },

    /**
     * Upload or update the book file of a project.
     * 
     * @route POST /projects/:projectId/book
     * @description Uploads a new book file or replaces the existing one.
     * @access Protected
     */
    async setBook(req, res) {
        try {
            const { projectId, fileId } = req.body;

            const projectIdNum = parseInt(projectId);
            const fileIdNum = parseInt(fileId);

            await ProjectService.setBook({
                project_id: projectIdNum,
                file_id: fileIdNum,
            });

            res.status(200).json({
                success: true,
                message: "Book updated successfully."
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to set project book.",
                
            });
        }
    },

    /**
     * Delete the book file associated with a project.
     * 
     * @route DELETE /projects/:projectId/book
     * @description Removes the book file linked to a project.
     * @access Protected
     */
    async deleteBook(req, res) {
        try {
            const { projectId } = req.query;

            const projectIdNum = parseInt(projectId);

            await ProjectService.deleteBook({ project_id: projectIdNum });

            res.status(200).json({
                success: true,
                message: "Book deleted successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete project book.",
                
            });
        }
    },

    /**
     * Get the presentation file associated with a project.
     * 
     * @route GET /projects/:projectId/presentation
     * @description Retrieves the presentation file metadata for a given project.
     * @access Protected
     */
    async getPresentation(req, res) {
        try {
            const { projectId } = req.query;

            const projectIdNum = parseInt(projectId);

            const presentation = await ProjectService.getPresentation({
                project_id: projectIdNum,
            });

            if (!presentation) {
                return res.status(404).json({
                    success: false,
                    message: "No presentation found for this project.",
                });
            }

            res.status(200).json({
                success: true,
                result: presentation,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve presentation.",
                
            });
        }
    },

    /**
     * Upload or update the presentation file of a project.
     * 
     * @route POST /projects/:projectId/presentation
     * @description Uploads a new presentation file or replaces the existing one.
     * @access Protected
     */
    async setPresentation(req, res) {
        try {
            const { projectId, fileId } = req.body;

            const projectIdNum = parseInt(projectId);

            // Associate file with project
            await ProjectService.setPresentation({
                project_id: projectIdNum,
                file_id: fileId,
            });

            res.status(200).json({
                success: true,
                message: "Presentation updated successfully."
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to set project presentation.",
                
            });
        }
    },

    /**
     * Delete the presentation file associated with a project.
     * 
     * @route DELETE /projects/:projectId/presentation
     * @description Removes the presentation file linked to a project.
     * @access Protected
     */
    async deletePresentation(req, res) {
        try {
            const { projectId } = req.query;

            const projectIdNum = parseInt(projectId);

            await ProjectService.deletePresentation({
                project_id: projectIdNum
            });

            res.status(200).json({
                success: true,
                message: "Presentation deleted successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete presentation.",
                
            });
        }
    },
};

module.exports = projectFileController;