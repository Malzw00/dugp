const ProjectReferenceService = require("@services/project/projectReference.service");
const ReferenceService = require("@services/project/reference.service");

/**
 * @controller projectFileController
 * @description Controller for handling project-related files such as books, presentations, and references.
 * Provides endpoints for uploading, retrieving, and deleting files associated with a project.
 */
const projectReferenceController = {

    /**
     * Get all references linked to a project.
     * 
     * @route GET /projects/:projectId/references
     * @description Retrieves all references associated with a project.
     * @access Protected
     */
    async getReferences(req, res) {
        try {
            const { projectId } = req.query;

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
            const { projectId, referenceId } = req.body;
            const projectIdNum = parseInt(projectId);
            const referenceIdNum = parseInt(referenceId);

            const addedRef = await ProjectReferenceService.Project.addReference({
                project_id: projectIdNum,
                reference_id: referenceIdNum,
            });

            res.status(201).json({
                success: true,
                message: "Reference added successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "An error occurred while adding the reference.",
                
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
            const { projectId, referenceId } = req.query;

            const referenceIdNum = parseInt(referenceId);
            const projectIdNum = parseInt(projectId);

            const deleted = await ProjectReferenceService.Project.removeReference({ 
                reference_id: referenceIdNum,
                project_id: projectIdNum,
            });

            res.status(200).json({
                success: !!deleted,
                message: deleted && 
                    "Reference not found or already removed." || "Reference removed successfully.",
            });

            // Background check: delete reference if unused
            (async () => {
                try {
                    const isReferenceUsed = await ProjectReferenceService.Reference.isReferenceUsed({
                        reference_id: referenceIdNum,
                    });
                    if (!isReferenceUsed) {
                        await ReferenceService.delete({ reference_id: referenceIdNum });
                    }
                } catch (innerError) {
                    // Log but do not affect response
                    console.error("Background deletion failed for reference:", innerError);
                }
            })();

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove reference.",
            });
        }
    }
};

module.exports = projectReferenceController;