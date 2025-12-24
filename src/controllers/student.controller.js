/**
 * @file student.controller.js
 * @description Controller responsible for managing student-related operations such as
 * CRUD actions, linking accounts, and retrieving associated data.
 */

const AccountService = require("@services/account/account.service");
const StudentService = require("@services/people/student.service");


const studentController = {

    /**
     * @route GET /students
     * @description Retrieve all students with pagination.
     * @query {number} [offset] - Number of records to skip (default: 0).
     * @query {number} [limit] - Number of records to return (default: 20).
     */
    async getAll(req, res) {
        try {
            const { offset, limit } = req.query;
            const offsetNum = parseInt(offset) || 0;
            const limitNum  = parseInt(limit) || 20;

            const students = await StudentService.getAll({ offset: offsetNum, limit: limitNum });

            if (!students) {
                return res.status(400).json({ success: false, message: "No students found." });
            }

            res.status(200).json({ success: true, result: students });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    
    /**
     * @route GET /students/search
     * @description search for students
     * @query {number} [offset] - Number of records to skip (default: 0).
     * @query {number} [limit] - Number of records to return (default: 20).
     */
    async search(req, res) {
        try {
            const { offset, limit, text } = req.query;
            const offsetNum = parseInt(offset) || null;
            const limitNum  = parseInt(limit) || null;

            const students = await StudentService.searchByName({ 
                text,
                offset: offsetNum, 
                limit: limitNum 
            });

            if (!students) {
                return res.status(400).json({ success: false, message: "No Result." });
            }

            res.status(200).json({ success: true, result: students });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * @route GET /students/:studentId
     * @description Retrieve a single student by ID.
     * @param {number} studentId - Student's unique ID.
     */
    async getByID(req, res) {
        try {
            const { studentId } = req.params;

            const student = await StudentService.get({ student_id: studentId });

            if (!student) {
                return res.status(404).json({ success: false, message: "Student not found." });
            }

            res.status(200).json({ success: true, result: student });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * @route POST /students
     * @description Create a new student record.
     * @body {string} name
     * @body {string} fatherName
     * @body {string} grandFatherName
     * @body {string} familyName
     * @body {number} departmentId
     */
    async create(req, res) {
        try {
            const { name, email, fatherName, grandFatherName, familyName, departmentId, fullName } = req.body;
            const departmentIdNum = parseInt(departmentId);

            const created = await StudentService.create({
                name,
                father_name: fatherName,
                grand_father_name: grandFatherName,
                family_name: familyName,
                department_id: departmentIdNum,
                full_name: fullName,
                email,
            });

            if (!created) {
                return res.status(400).json({ success: false, message: "Failed to create student." });
            }

            res.status(201).json({ success: true, result: created });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * @route DELETE /students/:studentId
     * @description Delete a student by ID.
     * @param {number} studentId - Student ID.
     */
    async delete(req, res) {
        try {
            const { studentId } = req.params;

            const deleted = await StudentService.delete({ student_id: studentId });

            if (!deleted) {
                return res.status(400).json({ success: false, message: "Failed to delete student." });
            }

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * @route PUT /students/:studentId
     * @description Update student information.
     * @param {number} studentId
     * @body {string} name
     * @body {string} fatherName
     * @body {string} grandFatherName
     * @body {string} familyName
     * @body {number} departmentId
     * @body {uuid} accountId
     * @body {number} imageId
     */
    async update(req, res) {
        try {
            const { studentId } = req.params;
            const {
                name, fatherName, grandFatherName,
                familyName, departmentId, imageId, accountId, email, fullName
            } = req.body;

            const departmentIdNum = parseInt(departmentId);
            const imageIdNum = parseInt(imageId);

            const updated = await StudentService.update({
                student_id: studentId,
                name,
                email,
                father_name: fatherName,
                grand_father_name: grandFatherName,
                family_name: familyName,
                department_id: departmentIdNum,
                account_id: accountId,
                image_id: imageIdNum,
                full_name: fullName,
            });

            if (!updated) {
                return res.status(400).json({ success: false, message: "Failed to update student." });
            }

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * @route GET /students/:studentId/account
     * @description Retrieve account linked to a specific student.
     */
    async getAccount(req, res) {
        try {
            const { studentId } = req.params;
            const studentIdNum = parseInt(studentId);

            const student = await StudentService.get({ student_id: studentIdNum });
            if (!student) {
                return res.status(404).json({ success: false, message: "Student not found." });
            }

            const account = await AccountService.getByID({ account_id: student.account_id });
            if (!account) {
                return res.status(404).json({ success: false, message: "Account not found." });
            }

            res.status(200).json({ success: true, result: account });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * @route POST /students/:studentId/account
     * @description Link an account to a student.
     * @body {uuid} accountId
     */
    async addAccount(req, res) {
        try {
            const { studentId } = req.params;
            const { accountId } = req.body;
            const studentIdNum = parseInt(studentId);

            const updated = await StudentService.updateAccount({
                student_id: studentIdNum,
                account_id: accountId,
            });

            if (!updated) {
                return res.status(400).json({ success: false, message: "Failed to link account." });
            }

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * @route DELETE /students/:studentId/account
     * @description Unlink an account from a student.
     */
    async removeAccount(req, res) {
        try {
            const { studentId } = req.params;
            const studentIdNum = parseInt(studentId);

            const updated = await StudentService.updateAccount({
                student_id: studentIdNum,
                account_id: null,
            });

            if (!updated) {
                return res.status(400).json({ success: false, message: "Failed to unlink account." });
            }

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = studentController;
