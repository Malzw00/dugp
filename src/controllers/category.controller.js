const CategoryService = require("@services/academic/category.service");
const ProjectCategoryService = require("@services/project/projectCategory.service");

/**
 * @controller categoryController
 * @description Controller responsible for handling operations related to academic categories.
 * Provides CRUD endpoints for managing categories and linking projects with categories.
 */
const categoryController = {

    /**
     * @route GET /categories
     * @description Retrieve all categories, optionally filtered by collage ID.
     * @query {number} collageId - Optional collage ID to filter categories.
     * @access public
     */
    async getAll(req, res) {
        try {
            const { collageId } = req.query;

            const collageIdNum = collageId ? parseInt(collageId) : null;

            const categories = await CategoryService.getAll({
                collage_id: collageIdNum,
            });

            if (!categories) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to retrieve categories.",
                });
            }

            res.status(200).json({
                success: true,
                result: categories,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error while fetching categories.",
                error: error.message,
            });
        }
    },

    /**
     * @route POST /categories
     * @description Create a new category.
     * @body {string} name - Category name.
     * @body {number} collageId - ID of the collage the category belongs to.
     * @access admin
     */
    async create(req, res) {
        try {
            const { name, collageId } = req.body;

            if (!name || !collageId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields (name, collageId).",
                });
            }

            const collageIdNum = parseInt(collageId);

            const created = await CategoryService.create({
                category_name: name,
                collage_id: collageIdNum,
            });

            if (!created) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create category.",
                });
            }

            res.status(201).json({
                success: true,
                message: "Category created successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error while creating category.",
                error: error.message,
            });
        }
    },

    /**
     * @route DELETE /categories/:categoryId
     * @description Delete a category by its ID.
     * @param {number} categoryId - ID of the category to delete.
     * @access admin
     */
    async deleteByID(req, res) {
        try {
            const { categoryId } = req.params;

            const categoryIdNum = parseInt(categoryId);

            const deleted = await CategoryService.delete({ category_id: categoryIdNum });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or delete failed.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Category deleted successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error while deleting category.",
                error: error.message,
            });
        }
    },

    /**
     * @route PATCH /categories/:categoryId
     * @description Update category name or collage ID.
     * @param {number} categoryId - ID of the category to update.
     * @body {string} [name] - New category name.
     * @body {number} [collageId] - New collage ID.
     * @access admin
     */
    async update(req, res) {
        try {
            const { categoryId } = req.params;
            const { name, collageId } = req.body;

            const categoryIdNum = parseInt(categoryId);

            if (!name && !collageId) {
                return res.status(400).json({
                    success: false,
                    message: "Nothing to update.",
                });
            }

            if (name) {
                await CategoryService.updateName({
                    category_id: categoryIdNum,
                    category_name: name,
                });
            }

            if (collageId) {
                const collageIdNum = parseInt(collageId);
                await CategoryService.updateCollage({
                    category_id: categoryIdNum,
                    collage_id: collageIdNum,
                });
            }

            res.status(200).json({
                success: true,
                message: "Category updated successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error while updating category.",
                error: error.message,
            });
        }
    },

    /**
     * @route GET /categories/:categoryId/projects
     * @description Get all projects linked to a specific category.
     * @param {number} categoryId - Category ID.
     * @query {number} [limit] - Optional limit.
     * @query {number} [offset] - Optional offset.
     * @access public
     */
    async getProjects(req, res) {
        try {
            const { categoryId } = req.params;
            const { limit, offset } = req.query;

            const categoryIdNum = parseInt(categoryId);
            const limitNum = limit ? parseInt(limit) : null;
            const offsetNum = offset ? parseInt(offset) : null;

            const projects = await ProjectCategoryService.Category.getProjects({
                category_id: categoryIdNum,
                offset: offsetNum,
                limit: limitNum,
            });

            if (!projects) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to retrieve projects for category.",
                });
            }

            res.status(200).json({
                success: true,
                result: projects,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error while fetching category projects.",
                error: error.message,
            });
        }
    },

    /**
     * @route POST /categories/:categoryId/projects
     * @description Link a project to a category.
     * @param {number} categoryId - Category ID.
     * @body {number} projectId - Project ID to add.
     * @access admin
     */
    async addProject(req, res) {
        try {
            const { categoryId } = req.params;
            const { projectId } = req.body;

            const categoryIdNum = parseInt(categoryId);
            const projectIdNum = parseInt(projectId);

            const created = await ProjectCategoryService.Category.addProject({
                category_id: categoryIdNum,
                project_id: projectIdNum,
            });

            if (!created) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to link project to category.",
                });
            }

            res.status(201).json({
                success: true,
                message: "Project linked to category successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error while linking project.",
                error: error.message,
            });
        }
    },

    /**
     * @route DELETE /categories/:categoryId/projects
     * @description Remove a project from a category.
     * @param {number} categoryId - Category ID.
     * @body {number} projectId - Project ID to remove.
     * @access admin
     */
    async removeProject(req, res) {
        try {
            const { categoryId } = req.params;
            const { projectId } = req.body;

            const categoryIdNum = parseInt(categoryId);
            const projectIdNum = parseInt(projectId);

            const deleted = await ProjectCategoryService.Category.removeProject({
                category_id: categoryIdNum,
                project_id: projectIdNum,
            });

            if (!deleted) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to remove project from category.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Project removed from category successfully.",
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error while removing project.",
                error: error.message,
            });
        }
    },
};

module.exports = categoryController;
