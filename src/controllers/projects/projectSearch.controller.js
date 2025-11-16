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
                keyword, 
                categories,
                collages,
                departments,
                orderBy,
                orderDir,
                offset,
                limit
            } = req.filters;

            // تحويل كل القيم إلى أرقام عند الحاجة
            const categoriesArray = categories.map(Number);
            const collagesArray = collages.map(Number);
            const departmentsArray = departments.map(Number);

            // استدعاء خدمة البحث
            const projects = await ProjectService.search({
                searchText: keyword,
                filters: {
                    category_ids: categoriesArray,
                    collage_ids: collagesArray,
                    department_ids: departmentsArray,
                },
                offset,
                limit,
                order: {
                    by: orderBy,
                    dir: orderDir,
                },
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