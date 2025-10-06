const express = require('express');
const router = express.Router();

/**
 * @route GET /students
 * @description Retrieve a paginated list of all students.
 * @query {number} offset - Starting index for pagination.
 * @query {number} limit - Number of results to return.
 * @access Public
 */
router.get('/', );

/**
 * @route GET /students/projects
 * @description Retrieve all projects that the students have participated in.
 * @access Public
 */
router.get('/projects', );

/**
 * @route GET /students/:studentId
 * @description Retrieve details of a specific student by ID.
 * @param {string} studentId - Unique identifier of the student.
 * @access Public
 */
router.get('/:studentId', );

/**
 * @route POST /students
 * @description Create a new student record.
 * @body {string} name - Student's full name.
 * @body {string} collageId - ID of the student's collage.
 * @body {string} departmentId - ID of the student's department.
 * @access Admin (requires permission)
 */
router.post('/', );

/**
 * @route PUT /students/:studentId
 * @description Update information of a student by ID.
 * @param {string} studentId - Unique identifier of the student.
 * @body {object} updates - Fields to update (e.g., name, department).
 * @access Admin (requires permission)
 */
router.put('/:studentId', );

/**
 * @route DELETE /students/:studentId
 * @description Delete a student record by ID.
 * @param {string} studentId - Unique identifier of the student.
 * @access Admin (requires permission)
 */
router.delete('/:studentId', );

/**
 * @route GET /students/account
 * @description Retrieve linked account information for a student.
 * @access Admin (requires permission)
 */
router.get('/account', );

/**
 * @route POST /students/account
 * @description Link a student to a platform account.
 * @body {string} studentId - ID of the student to link.
 * @body {string} accountId - ID of the account to link.
 * @access Admin (requires permission)
 */
router.post('/account', );

/**
 * @route DELETE /students/account
 * @description Unlink a student from a platform account.
 * @body {string} studentId - ID of the student to unlink.
 * @access Admin (requires permission)
 */
router.delete('/account', );


module.exports = router;