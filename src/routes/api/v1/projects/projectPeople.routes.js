const express = require('express');
const projectPeopleRouter  = express.Router();

/**
 * @route GET /students
 * @description Get a list of all students.
 * @access any (no authentication required)
 */
projectPeopleRouter.get('/students', );

/**
 * @route DELETE /students/:studentId
 * @description Delete a specific student by their ID.
 * @access ahp (admin with permission)
 * @param {string} studentId - The unique identifier of the student.
 */
projectPeopleRouter.delete('/students/:studentId', );

/**
 * @route POST /students/:studentId
 * @description Add a new student or update an existing student by ID.
 * @access ahp (admin with permission)
 * @body {number} studentId - The unique identifier of the student.
 */
projectPeopleRouter.post('/students', );

/**
 * @route GET /supervisor
 * @description Get a list of all supervisors.
 * @access any (no authentication required)
 */
projectPeopleRouter.get('/supervisor', );

/**
 * @route DELETE /supervisor/:supervisorId
 * @description Delete a specific supervisor by their ID.
 * @access ahp (admin with permission)
 * @param {string} supervisorId - The unique identifier of the supervisor.
 */
projectPeopleRouter.delete('/supervisor', );

/**
 * @route PUT /supervisor/:supervisorId
 * @description Update details of a specific supervisor by their ID.
 * @access ahp (admin with permission)
 * @body {number} supervisorId - The unique identifier of the supervisor.
 */
projectPeopleRouter.put('/supervisor', );


module.exports = projectPeopleRouter;