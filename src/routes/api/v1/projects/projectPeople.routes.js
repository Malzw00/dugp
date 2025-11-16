const express = require('express');
const projectPeopleRouter  = express.Router();
const controller = require("@controllers/projects/projectPeople.controller");

/**
 * @route GET /projects/:projectId/people/students
 * @description Get all students associated with a specific project.
 * @access any (no authentication required)
 * @param {string} projectId - The ID of the project.
 */
projectPeopleRouter.get('/students', controller.getStudents);

/**
 * @route POST /projects/:projectId/people/students
 * @description Add a new student to the project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @body {number} studentId - The ID of the student to add.
 */
projectPeopleRouter.post('/students', controller.addStudent);

/**
 * @route DELETE /projects/:projectId/people/students/:studentId
 * @description Remove a student from the project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @param {string} studentId - The ID of the student to remove.
 */
projectPeopleRouter.delete('/students/:studentId', controller.removeStudent);

/**
 * @route GET /projects/:projectId/people/supervisor
 * @description Get the supervisor assigned to the project.
 * @access any (no authentication required)
 * @param {string} projectId - The ID of the project.
 */
projectPeopleRouter.get('/supervisor', controller.getSupervisor);

/**
 * @route PUT /projects/:projectId/people/supervisor/:supervisorId
 * @description Set or update the supervisor of the project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @param {string} supervisorId - The ID of the supervisor to set.
 */
projectPeopleRouter.put('/supervisor/:supervisorId', controller.setSupervisor);

/**
 * @route DELETE /projects/:projectId/people/supervisor/:supervisorId
 * @description Remove the supervisor from the project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @param {string} supervisorId - The ID of the supervisor to remove.
 */
projectPeopleRouter.delete('/supervisor/:supervisorId', controller.removeSupervisor);

module.exports = projectPeopleRouter;