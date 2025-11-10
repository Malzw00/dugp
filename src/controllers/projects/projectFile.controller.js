const FileService = require("@root/src/services/File.service");
const ProjectReferenceService = require("@root/src/services/project/projectReference.service");
const ReferenceService = require("@root/src/services/project/reference.service");
const ProjectService = require("@services/project/project.service");
const path = require('path');

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
            const { projectId } = req.params;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const book = await ProjectService.getBook({ project_id: projectIdNum });

            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found for the given project.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Book retrieved successfully.",
                result: book,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project book.",
                error: error.message,
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
            const { projectId } = req.params;
            const uploaderId = req.user.accountID;
            const fileData = req.file;

            const projectIdNum = parseInt(projectId);
            if (!fileData) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded."
                });
            }

            const existingBook = await ProjectService.getBook({ project_id: projectIdNum });
            if (existingBook?.file_id) {
                await FileService.deleteFile(existingBook.file_id);
            }

            const file = await FileService.uploadFile({
                uploaderId,
                category: 'book',
                filePath: fileData.path,
                mimeType: fileData.mimetype,
                originalName: fileData.originalname,
            });

            await ProjectService.setBook({
                project_id: projectIdNum,
                file_id: file.file_id,
            });

            res.status(200).json({
                success: true,
                message: "Book updated successfully."
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to set project book.",
                error: error.message,
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
            const { projectId } = req.params;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const deleted = await ProjectService.deleteBook({ project_id: projectIdNum });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "No book found for this project.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Book deleted successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete project book.",
                error: error.message,
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
            const { projectId } = req.params;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

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
                error: error.message,
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
            const { projectId } = req.params;
            const uploaderId = req.user.accountID;
            const fileData = req.file;

            const projectIdNum = parseInt(projectId);
            if (!fileData) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded."
                });
            }

            // Check if project already has a presentation
            const existingPresentation = await ProjectService.getPresentation({ project_id: projectIdNum });
            if (existingPresentation?.file_id) {
                await FileService.deleteFile(existingPresentation.file_id);
            }

            // Upload the new presentation file
            const file = await FileService.uploadFile({
                uploaderId,
                category: 'presentation',
                filePath: fileData.path,
                mimeType: fileData.mimetype,
                originalName: fileData.originalname,
            });

            // Associate file with project
            await ProjectService.setPresentation({
                project_id: projectIdNum,
                file_id: file.file_id,
            });

            res.status(200).json({
                success: true,
                message: "Presentation updated successfully."
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to set project presentation.",
                error: error.message,
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
            const { projectId } = req.params;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const deleted = await ProjectService.deletePresentation({
                project_id: projectIdNum
            });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "No presentation found for this project.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Presentation deleted successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete presentation.",
                error: error.message,
            });
        }
    },

    /**
     * Get all references linked to a project.
     * 
     * @route GET /projects/:projectId/references
     * @description Retrieves all references associated with a project.
     * @access Protected
     */
    async getReferences(req, res) {
        try {
            const { projectId } = req.params;
            const projectIdNum = parseInt(projectId);
            const references = await ProjectReferenceService.Project.getReferences({ 
                project_id: projectIdNum 
            });

            res.status(200).json({
                success: true,
                result: references,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project references.",
                error: error.message,
            });
        }
    },

    /**
     * Add a new reference to a project.
     * 
     * @route POST /projects/:projectId/references
     * @description Creates a new reference and links it to a specific project.
     * @access Protected
     */
    async addReference(req, res) {
        try {
            const { projectId } = req.params;
            const { title, link, author } = req.body;

            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }
            if (!title || !link) {
                return res.status(400).json({
                    success: false,
                    message: "Both title and link are required.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const createdRef = await ReferenceService.create({ title, link, author });

            const addedRef = await ProjectReferenceService.Project.addReference({
                project_id: projectIdNum,
                reference_id: createdRef.reference_id,
            });

            if (!addedRef) {
                return res.status(404).json({
                    success: false,
                    message: "Failed to link reference to project.",
                });
            }

            res.status(201).json({
                success: true,
                message: "Reference added successfully.",
                reference: createdRef,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "An error occurred while adding the reference.",
                error: error.message,
            });
        }
    },
    
    /**
     * Remove a reference from a specific project by its ID.
     * 
     * @route DELETE /projects/:projectId/references/:referenceId
     * @description Deletes a reference record and automatically unlinks it from the project (via ON DELETE CASCADE).
     * @access Protected
     */
    async removeReferenceByID(req, res) {
        try {
            const { projectId, referenceId } = req.params;

            if (!projectId || isNaN(projectId) || !referenceId || isNaN(referenceId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId or referenceId.",
                });
            }

            const referenceIdNum = parseInt(referenceId);
            const referenceDeleted = await ReferenceService.delete({ reference_id: referenceIdNum });

            if (!referenceDeleted) {
                return res.status(404).json({
                    success: false,
                    message: "Reference not found or already removed.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Reference removed successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove reference.",
                error: error.message,
            });
        }
    }
};

module.exports = projectFileController;