const express = require('express');
const router = express.Router();
const controller = require('@controllers/student.controller');

/* -------------------------------------------------------------------------- */
/*                                   STUDENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /students
 * @description Retrieve a paginated list of all students.
 * @query {number} offset - Starting index for pagination.
 * @query {number} limit - Number of results to return.
 * @access Public
 */
router.get('/', controller.getAll);

/**
 * @route GET /students/:studentId
 * @description Retrieve details of a specific student by ID.
 * @param {string} studentId - Unique identifier of the student.
 * @access Public
 */
router.get('/:studentId', controller.getByID);

/**
 * @route POST /students
 * @description Create a new student record.
 * @body {string} name
 * @body {string} fatherName
 * @body {string} grandFatherName
 * @body {string} familyName
 * @body {number} departmentId
 * @access Admin (requires permission)
 */
router.post('/', controller.create);

/**
 * @route PUT /students/:studentId
 * @description Update information of a student by ID.
 * @param {string} studentId - Unique identifier of the student.
 * @body {string} name
 * @body {string} fatherName
 * @body {string} grandFatherName
 * @body {string} familyName
 * @body {number} departmentId
 * @body {number} accountId
 * @body {number} imageId
 * @access Admin (requires permission)
 */
router.put('/:studentId', controller.update);

/**
 * @route DELETE /students/:studentId
 * @description Delete a student record by ID.
 * @param {string} studentId - Unique identifier of the student.
 * @access Admin (requires permission)
 */
router.delete('/:studentId', controller.delete);

/* -------------------------------------------------------------------------- */
/*                              STUDENT ACCOUNT                               */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /students/:studentId/account
 * @description Retrieve linked account information for a specific student.
 * @param {string} studentId - ID of the student.
 * @access Admin (requires permission)
 */
router.get('/:studentId/account', controller.getAccount);

/**
 * @route POST /students/:studentId/account
 * @description Link a student to a platform account.
 * @param {string} studentId - ID of the student.
 * @body {number} accountId - ID of the account to link.
 * @access Admin (requires permission)
 */
router.post('/:studentId/account', controller.addAccount);

/**
 * @route DELETE /students/:studentId/account
 * @description Unlink a student from a platform account.
 * @param {string} studentId - ID of the student.
 * @access Admin (requires permission)
 */
router.delete('/:studentId/account', controller.removeAccount);

module.exports = router;
