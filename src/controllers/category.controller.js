const CategoryService = require("@services/academic/category.service");
const ProjectCategoryService = require("@services/project/projectCategory.service");

const categoryController = {

    async getAll(req, res) {
        try {
            const { collageId } = req.query;

            const collageIdNum = parseInt(collageId);

            const categories = await CategoryService.getAll({
                collage_id: collageIdNum,
            });

            res.status(200).json({
                success: true,
                result: categories,
            });

        } catch (error) {
            
        }
    },
    
    async create(req, res) {
        try {
            const { name, collageId } = req.body;

            const collageIdNum = parseInt(collageId);

            const created = await CategoryService.create({
                category_name: name,
                collage_id: collageIdNum,
            });

            if(!created) {
                res.status(400).json({
                    success: false,
                })
                return;
            }

            res.status(201).json({
                success: true,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
            });
        }
    },

    async deleteByID(req, res) {
        try {
            const { categoryId } = req.params;

            const categoryIdNum = parseInt(categoryId);

            const deleted = await CategoryService.delete({ category_id: categoryIdNum });

            if(!deleted) {
                res.status(400).json({
                    success: false,
                });
                return;
            }

            res.status(200).json({
                success: true,
            })

        } catch (error) {
            
        }
    },

    async update(req, res) {
        try {
            const { categoryId } = req.params;
            const { name, collageId } = req.body;

            const categoryIdNum = parseInt(categoryId);
            
            if(name)
            await CategoryService.updateName({
                category_id: categoryIdNum,
                category_name: name,
            });

            if(collageId) {
                const collageIdNum = parseInt(collageId);
                await CategoryService.updateCollage({
                    category_id: categoryIdNum,
                    collage_id:  collageIdNum,
                });
            }

            res.status(200).json({
                success: true,
            });

        } catch (error) {
            
        }
    },

    async getProjects(req, res) {
        try {
            const { categoryId } = req.params;
            const { limit, offset } = req.query;

            const categoryIdNum = parseInt(categoryId);
            const limitNum = parseInt(limit);
            const offsetNum = parseInt(offset);

            const projects = await ProjectCategoryService.Category.getProjects({
                category_id: categoryIdNum,
                offset: offsetNum,
                limit: limitNum,
            });

            if(!projects) {
                res.status(400).json({
                    success: false,
                });
                return;
            }

            res.status(200).json({
                success: true,
                result: projects,
            })
        } catch (error) {
            
        }
    },

    async addProject(req, res) {
        try {
            const { categoryId } = req.params;
            const { projectId } = req.body;

            const categoryIdNum = parseInt(categoryId);
            const projectIdNum = parseInt(projectId);

            const created = await ProjectCategoryService.Category.addProject({
                category_id: categoryIdNum,
                project_id:  projectIdNum,
            });

            if(!created) {
                res.status(400).json({
                    success: false,
                });
                return;
            }

            res.status(201).json({
                success: true,
            })
        } catch (error) {
            
        }
    },

    async removeProject(req, res) {
        try {
            const { categoryId } = req.params;
            const { projectId } = req.body;

            const categoryIdNum = parseInt(categoryId);
            const projectIdNum = parseInt(projectId);

            const deleted = await ProjectCategoryService.Category.removeProject({
                category_id: categoryIdNum,
                project_id:  projectIdNum,
            });

            if(!deleted) {
                res.status(400).json({
                    success: false,
                });
                return;
            }

            res.status(201).json({
                success: true,
            })
        } catch (error) {
            
        }
    },
}


module.exports = categoryController;