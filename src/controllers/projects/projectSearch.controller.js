const ProjectService = require("@root/src/services/project/project.service");

const projectSearchController = {

    /**
     * @async
     * @function search
     * @description Searches for projects using a keyword and multiple optional filters such as category, department, collage, grade, semester, and date range.
     * @route GET /api/projects/search/:keyword
     * 
     * @param {import("express").Request} req - Express request object containing search parameters in params.
     * @param {import("express").Response} res - Express response object used to return the JSON response.
     * 
     * @returns {Promise<void>} Returns a JSON response containing a filtered list of projects.
     * 
     * @example
     * // Example Request:
     * GET /api/projects/search/ai?categories=1,2&collageId=3&startDate=2023-01-01&endDate=2024-12-31&orderBy=created_at&orderDir=DESC&limit=10&offset=0
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": [
     *     {
     *       "project_id": 12,
     *       "title": "AI-Based Traffic System",
     *       "collage_id": 3,
     *       "grade": "A",
     *       "semester": "Spring 2024"
     *     },
     *     ...
     *   ]
     * }
     */
    async search(req, res) {
        try {
            const { 
                keyword, 
                categories, 
                collageId, 
                startDate, 
                endDate, 
                orderBy, 
                orderDir, 
                limit, 
                offset,
                departmentId,
                grade,
                keywords,
                semester
            } = req.params;

            // Convert values to appropriate data types
            const offsetNum = parseInt(offset);
            const limitNum = parseInt(limit);
            const categoriesArray = categories ? categories.split(',').map(Number) : [];
            const collageIdNum = parseInt(collageId);
            const departmentIdNum = parseInt(departmentId);
            const gradeNum = parseInt(grade);

            // Execute search through the Project service layer
            const projects = await ProjectService.search({
                searchText: keyword,
                filters: {
                    category_ids: categoriesArray,
                    collage_id: collageIdNum,
                    department_id: departmentIdNum,
                    grade: gradeNum,
                    keywords,
                    semester,
                    date: {
                        start: startDate,
                        end: endDate
                    },
                },
                offset: offsetNum,
                limit: limitNum,
                order: {
                    by: orderBy,
                    dir: orderDir,
                },
            });

            // Successful response
            res.status(200).json({
                success: true,
                result: projects,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to perform project search.",
                error: error.message,
            });
        }
    }

}

module.exports = projectSearchController;