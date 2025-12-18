const ProjectService = require("@root/src/services/project/project.service");

const projectSearchController = {

    /**
     * @async
     * @function search
     * @description Searches for projects using a keyword and multiple optional filters such as category, department, collage, etc.
     * @route GET /projects/search
     * 
     * @param {import("express").Request} req - Express request object containing search parameters in req.filters.
     * @param {import("express").Response} res - Express response object used to return the JSON response.
     * 
     * @returns {Promise<void>} Returns a JSON response containing a filtered list of projects.
     */
    async search(req, res) {
        try {
            const { 
                text,
                offset,
                limit
            } = req.query;

            const projects = await ProjectService.search({
                searchText: text,
                offset: parseInt(offset) || null,
                limit: parseInt(limit) || null,
            });

            res.status(200).json({
                success: true,
                result: projects,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to perform project search.",
            });
        }
    }

};

module.exports = projectSearchController;