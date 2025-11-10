const SupervisorService = require("@root/src/services/people/supervisor.service");
const ProjectService = require("@root/src/services/project/project.service");
const ProjectStudentService = require("@services/project/projectStudent.service");

/**
 * @file projectPeople.controller.js
 * @description Controller responsible for handling operations related to project participants (students & supervisors).
 * Validates input and delegates business logic to corresponding service layers.
 * 
 * @module Controllers/ProjectPeopleController
 */
const projectPeopleController = {

    /**
     * @route GET /projects/:projectId/students
     * @description Retrieve all students assigned to a specific project.
     * @access public
     */
    async getStudents(req, res) {
        try {
            const { projectId } = req.params;

            // Validation
            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const projectStudents = await ProjectStudentService.Project.getStudents({
                project_id: projectIdNum,
            });

            res.status(200).json({
                success: true,
                result: projectStudents,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project students.",
                error: error.message,
            });
        }
    },

    /**
     * @route POST /projects/:projectId/students
     * @description Add a student to a specific project.
     * @access admin|manager
     * @body {number} studentId - The ID of the student to add.
     */
    async addStudent(req, res) {
        try {
            const { projectId } = req.params;
            const { studentId } = req.body;

            // Validation
            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            if (!studentId || isNaN(studentId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid studentId.",
                });
            }

            const created = await ProjectStudentService.Project.addStudent({
                project_id: parseInt(projectId),
                student_id: parseInt(studentId),
            });

            res.status(201).json({
                success: true,
                result: created,
                message: "Student added to project successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to add student to project.",
                error: error.message,
            });
        }
    },

    /**
     * @route DELETE /projects/:projectId/students/:studentId
     * @description Remove a student from a specific project.
     * @access admin|manager
     */
    async removeStudent(req, res) {
        try {
            const { projectId, studentId } = req.params;

            // Validation
            if (!projectId || isNaN(projectId) || !studentId || isNaN(studentId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId or studentId.",
                });
            }

            await ProjectStudentService.Project.removeStudent({
                project_id: parseInt(projectId),
                student_id: parseInt(studentId),
            });

            res.status(200).json({
                success: true,
                message: "Student removed from project successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove student from project.",
                error: error.message,
            });
        }
    },

    /**
     * @route GET /projects/:projectId/supervisor
     * @description Retrieve the supervisor assigned to a specific project.
     * @access public
     */
    async getSupervisor(req, res) {
        try {
            const { projectId } = req.params;

            // Validation
            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            const projectIdNum = parseInt(projectId);
            const project = await ProjectService.get({ project_id: projectIdNum });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found.",
                });
            }

            if (!project.supervisor_id) {
                return res.status(200).json({
                    success: true,
                    result: null,
                    message: "No supervisor assigned to this project.",
                });
            }

            const supervisor = await SupervisorService.get({
                supervisor_id: project.supervisor_id,
            });

            res.status(200).json({
                success: true,
                result: supervisor,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project supervisor.",
                error: error.message,
            });
        }
    },

    /**
     * @route DELETE /projects/:projectId/supervisor
     * @description Remove the supervisor assigned to a project.
     * @access admin|manager
     */
    async removeSupervisor(req, res) {
        try {
            const { projectId } = req.params;

            // Validation
            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            await ProjectService.update({
                project_id: parseInt(projectId),
                supervisor_id: null,
            });

            res.status(200).json({
                success: true,
                message: "Supervisor removed from project successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove supervisor from project.",
                error: error.message,
            });
        }
    },

    /**
     * @route PUT /projects/:projectId/supervisor
     * @description Assign or update a supervisor for a project.
     * @access admin|manager
     * @body {number} supervisorId - The ID of the supervisor to assign.
     */
    async setSupervisor(req, res) {
        try {
            const { projectId } = req.params;
            const { supervisorId } = req.body;

            // Validation
            if (!projectId || isNaN(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId.",
                });
            }

            if (!supervisorId || isNaN(supervisorId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid supervisorId.",
                });
            }

            await ProjectService.update({
                project_id: parseInt(projectId),
                supervisor_id: parseInt(supervisorId),
            });

            res.status(200).json({
                success: true,
                message: "Supervisor assigned to project successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to assign supervisor to project.",
                error: error.message,
            });
        }
    },
};

module.exports = projectPeopleController;