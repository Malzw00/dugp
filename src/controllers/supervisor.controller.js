const SupervisorService = require("@services/people/supervisor.service");
const AccountService = require("../services/account/account.service");

/**
 * @controller supervisorController
 * @description Handles supervisor CRUD operations and account management.
 */
const supervisorController = {

    /**
     * Get all supervisors with optional pagination.
     * @async
     * @function getAll
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async getAll(req, res) {
       try {
            const { limit, offset } = req.query;

            const offsetNum = offset !== undefined ? parseInt(offset) : 0;
            const limitNum = limit !== undefined ? parseInt(limit) : 10;

            if (isNaN(offsetNum) || isNaN(limitNum) || offsetNum < 0 || limitNum <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid pagination parameters. Offset must be a non-negative number and limit must be a positive number.',
                });
                return;
            }

            const supervisors = await SupervisorService.getAll({
                offset: offsetNum,
                limit: limitNum,
            });

            if (!supervisors) {
                res.status(404).json({
                    success: false,
                    message: 'No supervisors found.',
                });
                return;
            }

            res.status(200).json({
                success: true,
                result: supervisors,
            });
        } catch (error) {
            console.error('Error fetching supervisors:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve supervisors. Please try again later.',
            });
        }
    },
    
    /**
     * search for supervisors
     * @async
     * @function search
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async search(req, res) {
       try {
            const { text, limit, offset } = req.query;

            const offsetNum = parseInt(offset) || null;
            const limitNum = parseInt(limit) || null;

            const supervisors = await SupervisorService.searchByName({
                text,
                offset: offsetNum,
                limit: limitNum,
            });

            if (!supervisors) {
                res.status(404).json({
                    success: false,
                    message: 'No supervisors match the search criteria.',
                });
                return;
            }

            res.status(200).json({
                success: true,
                result: supervisors,
            });
        } catch (error) {
            console.error('Error searching supervisors:', error);
            res.status(500).json({
                success: false,
                message: 'Search operation failed. Please try again later.',
            });
        }
    },

    /**
     * Get supervisor by ID.
     * @async
     * @function getByID
     * @param {import('express').Request} req - Express request object containing `supervisorId` in params.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async getByID(req, res) {
        try {
            const { supervisorId } = req.params;

            const supervisor = await SupervisorService.get({ supervisor_id: supervisorId });

            if (!supervisor) {
                res.status(404).json({ success: false, message: 'Supervisor not found.' });
                return;
            }

            res.status(200).json({
                success: true,
                result: supervisor,
            });
        } catch (error) {
            console.error('Error fetching supervisor:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve supervisor details.' });
        }
    },

    /**
     * Get projects supervised by a specific supervisor.
     * @async
     * @function getProjects
     * @param {import('express').Request} req - Express request object containing `supervisorId`, `offset`, and `limit` in query.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async getProjects(req, res) {
        try {
            const { limit, offset, supervisorId } = req.query;

            const offsetNum = parseInt(offset);
            const limitNum = parseInt(limit);
            const supervisorIdNum = parseInt(supervisorId);

            const projects = await SupervisorService.getProjects({
                supervisor_id: supervisorIdNum,
                offset: offsetNum,
                limit: limitNum,
            });

            if (!projects) {
                res.status(404).json({ success: false, message: 'No projects found for this supervisor.' });
                return;
            }

            res.status(200).json({
                success: true,
                result: projects,
            });
        } catch (error) {
            console.error('Error fetching supervisor projects:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve supervisor projects.' });
        }
    },

    /**
     * Create a new supervisor.
     * @async
     * @function create
     * @param {import('express').Request} req - Express request object containing supervisor data in body.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async create(req, res) {
        try {
            const { name, fatherName, grandFatherName, familyName, title, email, departmentId, fullName } = req.body;

            const departmentIdNum = parseInt(departmentId);

            const supervisor = await SupervisorService.create({
                name,
                father_name: fatherName,
                grandfather_name: grandFatherName,
                family_name: familyName,
                title,
                email,
                department_id: departmentIdNum,
                full_name: fullName,
            });

            if (!supervisor) {
                res.status(400).json({ success: false, message: 'Failed to create supervisor. Please check your data.' });
                return;
            }

            res.status(201).json({
                success: true,
                result: supervisor,
                message: 'Supervisor created successfully.'
            });
        } catch (error) {
            console.error('Error creating supervisor:', error);
            res.status(500).json({ success: false, message: 'Failed to create supervisor.' });
        }
    },

    /**
     * Delete a supervisor by ID.
     * @async
     * @function delete
     * @param {import('express').Request} req - Express request object containing `supervisorId` in params.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async delete(req, res) {
        try {
            const { supervisorId } = req.params;
            const supervisorIdNum = parseInt(supervisorId);

            const deleted = await SupervisorService.delete({ supervisor_id: supervisorIdNum });

            if (!deleted) {
                res.status(404).json({ success: false, message: 'Supervisor not found or already deleted.' });
                return;
            }

            res.status(200).json({ 
                success: true,
                message: 'Supervisor deleted successfully.' 
            });
        } catch (error) {
            console.error('Error deleting supervisor:', error);
            res.status(500).json({ success: false, message: 'Failed to delete supervisor.' });
        }
    },

    /**
     * Update supervisor information.
     * @async
     * @function update
     * @param {import('express').Request} req - Express request object containing supervisor data in body and `supervisorId` in params.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async update(req, res) {
        try {
            const { 
                name, fatherName, grandFatherName, familyName, 
                title, email, accountId, imageId, departmentId 
            } = req.body;
            const { supervisorId } = req.params;

            const imageIdNum = parseInt(imageId);
            const departmentIdNum = parseInt(departmentId);

            const updated = await SupervisorService.update({
                supervisor_id: supervisorId,
                name,
                father_name: fatherName,
                grandfather_name: grandFatherName,
                family_name: familyName,
                title,
                email,
                account_id: accountId,
                department_id: departmentIdNum,
                image_id: imageIdNum,
            });

            if (!updated) {
                res.status(404).json({ success: false, message: 'Supervisor not found or update failed.' });
                return;
            }

            res.status(200).json({ 
                success: true,
                message: 'Supervisor updated successfully.' 
            });
        } catch (error) {
            console.error('Error updating supervisor:', error);
            res.status(500).json({ success: false, message: 'Failed to update supervisor.' });
        }
    },

    /**
     * Get the account associated with a supervisor.
     * @async
     * @function getAccount
     * @param {import('express').Request} req - Express request object containing `supervisorId` in params.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async getAccount(req, res) {
        try {
            const { supervisorId } = req.params;
            const supervisorIdNum = parseInt(supervisorId);

            const supervisor = await SupervisorService.get({ supervisor_id: supervisorIdNum });

            if (!supervisor) {
                res.status(404).json({ success: false, message: 'Supervisor not found.' });
                return;
            }

            if (!supervisor.account_id) {
                res.status(404).json({ success: false, message: 'No account associated with this supervisor.' });
                return;
            }

            const account = await AccountService.getByID({ account_id: supervisor.account_id });

            if (!account) {
                res.status(404).json({ success: false, message: 'Associated account not found.' });
                return;
            }

            res.status(200).json({
                success: true,
                result: account,
            });
        } catch (error) {
            console.error('Error fetching supervisor account:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve supervisor account.' });
        }
    },

    /**
     * Associate an existing account with a supervisor.
     * @async
     * @function addAccount
     * @param {import('express').Request} req - Express request object containing `accountId` in body and `supervisorId` in params.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async addAccount(req, res) {
        try {
            const { accountId } = req.body;
            const { supervisorId } = req.params;

            const supervisorIdNum = parseInt(supervisorId);

            const updated = await SupervisorService.updateAccount({
                supervisor_id: supervisorIdNum,
                account_id: accountId,
            });

            if (!updated) {
                res.status(400).json({ success: false, message: 'Failed to associate account with supervisor.' });
                return;
            }

            res.status(200).json({ 
                success: true,
                message: 'Account associated successfully.' 
            });
        } catch (error) {
            console.error('Error adding account to supervisor:', error);
            res.status(500).json({ success: false, message: 'Failed to associate account.' });
        }
    },

    /**
     * Remove the associated account from a supervisor.
     * @async
     * @function removeAccount
     * @param {import('express').Request} req - Express request object containing `supervisorId` in params.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async removeAccount(req, res) {
        try {
            const { supervisorId } = req.params;
            const supervisorIdNum = parseInt(supervisorId);

            const updated = await SupervisorService.updateAccount({
                supervisor_id: supervisorIdNum,
                account_id: null,
            });

            if (!updated) {
                res.status(400).json({ success: false, message: 'Failed to remove account association.' });
                return;
            }

            res.status(200).json({ 
                success: true,
                message: 'Account association removed successfully.' 
            });
        } catch (error) {
            console.error('Error removing account from supervisor:', error);
            res.status(500).json({ success: false, message: 'Failed to remove account association.' });
        }
    },
};

module.exports = supervisorController;