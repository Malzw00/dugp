const CollageService = require("@services/academic/collage.service");
const DepartmentService = require("@services/academic/department.service");

/**
 * @controller collageController
 * @description Controller responsible for handling all operations related to collages and their departments.
 * Provides CRUD endpoints for managing collages and associated departments.
 */
const collageController = {

    /**
     * @route GET /collages
     * @description Retrieve all collages with optional pagination (offset, limit).
     * @query {number} [offset] - Optional number of records to skip.
     * @query {number} [limit] - Optional maximum number of records to return.
     * @access public
     */
    async getAll(req, res) {
        try {
            const { offset, limit } = req.query;

            const offsetNum = parseInt(offset) || null;
            const limitNum  = parseInt(limit)  || null;

            const collages = await CollageService.getAll({
                offset: offsetNum,
                limit: limitNum,
            });

            if (!collages) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to retrieve collages.',
                });
            }

            res.status(200).json({
                success: true,
                result: collages,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while fetching collages.',
                error: error.message,
            });
        }
    },

    /**
     * @route GET /collages/:collageId
     * @description Retrieve a single collage by its ID.
     * @param {number} collageId - The ID of the collage to retrieve.
     * @access public
     */
    async getByID(req, res) {
        try {
            const { collageId } = req.params;
            const collageIdNum = parseInt(collageId);

            const collage = await CollageService.get({
                collage_id: collageIdNum,
            });

            if (!collage) {
                return res.status(404).json({
                    success: false,
                    message: 'Collage not found.',
                });
            }

            res.status(200).json({
                success: true,
                result: collage,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while fetching collage.',
                error: error.message,
            });
        }
    },

    /**
     * @route POST /collages
     * @description Create a new collage record.
     * @body {string} collageName - The name of the collage to create.
     * @access admin
     */
    async create(req, res) {
        try {
            const { collageName } = req.body;

            const created = await CollageService.create({
                collage_name: collageName,
            });

            if (!created) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to create collage.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Collage created successfully.',
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while creating collage.',
                error: error.message,
            });
        }
    },

    /**
     * @route DELETE /collages/:collageId
     * @description Delete a collage by its ID.
     * @param {number} collageId - The collage ID to delete.
     * @access admin
     */
    async deleteByID(req, res) {
        try {
            const { collageId } = req.params;
            const collageIdNum = parseInt(collageId);

            const deleted = await CollageService.delete({
                collage_id: collageIdNum,
            });

            if (!deleted) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to delete collage.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Collage deleted successfully.',
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while deleting collage.',
                error: error.message,
            });
        }
    },

    /**
     * @route PUT /collages/:collageId
     * @description Update the name of a collage.
     * @param {number} collageId - Collage ID to update.
     * @body {string} collageName - New collage name.
     * @access admin
     */
    async update(req, res) {
        try {
            const { collageId } = req.params;
            const { collageName } = req.body;

            const collageIdNum = parseInt(collageId);

            const updated = await CollageService.updateName({
                collage_id: collageIdNum,
                collage_name: collageName,
            });

            if (!updated) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to update collage name.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Collage updated successfully.',
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while updating collage.',
                error: error.message,
            });
        }
    },

    /**
     * @route GET /collages/:collageId/departments
     * @description Retrieve all departments belonging to a collage.
     * @param {number} collageId - Collage ID.
     * @access public
     */
    async getDepartments(req, res) {
        try {
            const { collageId } = req.params;
            const collageIdNum = parseInt(collageId);

            const departments = await DepartmentService.getDepartments({
                collage_id: collageIdNum,
            });

            if (!departments) {
                return res.status(404).json({
                    success: false,
                    message: 'No departments found for this collage.',
                });
            }

            res.status(200).json({
                success: true,
                result: departments,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while fetching departments.',
                error: error.message,
            });
        }
    },

    /**
     * @route GET /collages/:collageId/departments/:departmentId
     * @description Retrieve a specific department under a collage.
     * @param {number} collageId - Parent collage ID.
     * @param {number} departmentId - Department ID.
     * @access public
     */
    async getDepartment(req, res) {
        try {
            const { departmentId } = req.params;
            const departmentIdNum = parseInt(departmentId);

            const department = await DepartmentService.getDepartment({
                department_id: departmentIdNum,
            });

            if (!department) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found.',
                });
            }

            res.status(200).json({
                success: true,
                result: department,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while fetching department.',
                error: error.message,
            });
        }
    },

    /**
     * @route POST /collages/:collageId/departments
     * @description Create a new department under a specific collage.
     * @param {number} collageId - The collage ID to associate with.
     * @body {string} name - The name of the department to create.
     * @access admin
     */
    async addDepartment(req, res) {
        try {
            const { collageId } = req.params;
            const { name } = req.body;

            const collageIdNum = parseInt(collageId);

            const created = await DepartmentService.create({
                collage_id: collageIdNum,
                department_name: name,
            });

            if (!created) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to create department.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Department created successfully.',
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while creating department.',
                error: error.message,
            });
        }
    },

    /**
     * @route DELETE /departments/:departmentId
     * @description Delete a department by its ID.
     * @param {number} departmentId - The department ID to delete.
     * @access admin
     */
    async removeDepartment(req, res) {
        try {
            const { departmentId } = req.params;
            const departmentIdNum = parseInt(departmentId);

            const deleted = await DepartmentService.delete({
                department_id: departmentIdNum,
            });

            if (!deleted) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to delete department.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Department deleted successfully.',
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while deleting department.',
                error: error.message,
            });
        }
    },
    
    
    /**
     * @route UPDATE /departments/:departmentId
     * @description Delete a department by its ID.
     * @param {number} departmentId - The department ID to delete.
     * @param {string} name
     * @access admin
     */
    async updateDepartment(req, res) {
        try {
            const { departmentId, } = req.params;
            const { name, collageId, } = req.body;

            const departmentIdNum = parseInt(departmentId);
            const collageIdNum = parseInt(collageId);

            const updated = await DepartmentService.update(departmentIdNum, {
                collage_id: collageIdNum,
                department_name: name,
            });

            if (!updated) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to update department.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Department updated successfully.',
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error while updating department.',
                error: error.message,
            });
        }
    },
};

module.exports = collageController;