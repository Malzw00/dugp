const { models } = require("@root/src/config/database.config");
const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");
const { Op, } = require("sequelize");

/**
 * Service for managing student records and operations.
 * Handles CRUD operations, search functionality, and student data management
 * including name fields, department associations, and account linkages.
 */
class StudentService {

    static #logger = new ServiceErrorLogger({ module: 'Student' });

    /**
     * Creates a new student record with the provided details.
     * 
     * @param {Object} params - Student creation parameters
     * @param {string} params.name - Student's first name
     * @param {string} params.father_name - Student's father's name
     * @param {string} params.grand_father_name - Student's grandfather's name
     * @param {string} params.family_name - Student's family name
     * @param {number} params.department_id - ID of the department the student belongs to
     * @returns {Promise<Object>} The created student record
     * @throws {Error} If database operation fails or validation errors occur
     */
    static async create ({ name, father_name, grand_father_name, family_name, department_id, }) {
        try {
            const created = await models.Student.create({
                student_name: name,
                student_father_name: father_name,
                student_grandfather_name: grand_father_name,
                student_family_name: family_name,
                department_id: department_id,
            });
            return created;
        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }



    /**
     * Deletes a student record by student ID.
     * 
     * @param {Object} params - Deletion parameters
     * @param {number} params.student_id - ID of the student to delete
     * @returns {Promise<number>} Number of deleted rows (1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async delete ({ student_id }) {
        try {
            const deletedRows = await models.Student.destroy({ 
                where: { student_id: student_id } 
            });

            return deletedRows; 

        } catch (error) {
            throw this.#logger.log(this.delete.name, error);
        }
    }



    /**
     * Updates name fields for a specific student.
     * Only updates the fields that are provided in the parameters.
     * 
     * @param {Object} params - Name update parameters
     * @param {string} [params.name] - New first name (optional)
     * @param {string} [params.father_name] - New father's name (optional)
     * @param {string} [params.grand_father_name] - New grandfather's name (optional)
     * @param {string} [params.family_name] - New family name (optional)
     * @param {number} params.student_id - ID of the student to update
     * @returns {Promise<number>} Number of affected rows (1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async updateName ({ name, father_name, grand_father_name, family_name, student_id }) {
        try {

            const values = {};
            
            if(name) values.student_name = name;
            if(father_name) values.student_father_name = father_name;
            if(grand_father_name) values.student_grandfather_name = grand_father_name;
            if(family_name) values.student_family_name = family_name;

            const [affectedRows] = await models.Student.update(values, { 
                where: { student_id: student_id } 
            });

            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.updateName.name, error);
        }
    }
    


    /**
     * Updates the department association for a specific student.
     * 
     * @param {Object} params - Department update parameters
     * @param {number} params.department_id - New department ID
     * @param {number} params.student_id - ID of the student to update
     * @returns {Promise<number>} Number of affected rows (1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async updateDepartment ({ department_id, student_id }) {
        try {
            const [affectedRows] = await models.Student.update(
                { department_id: department_id }, 
                { where: { student_id: student_id } }
            );
            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.updateDepartment.name, error);
        }
    }
    


    /**
     * Updates the account association for a specific student.
     * Links a student record to a user account.
     * 
     * @param {Object} params - Account update parameters
     * @param {number} params.account_id - Account ID to associate with the student
     * @param {number} params.student_id - ID of the student to update
     * @returns {Promise<number>} Number of affected rows (1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async updateAccount ({ account_id, student_id }) {
        try {
            const [affectedRows] = await models.Student.update(
                { account_id: account_id }, 
                { where: { student_id: student_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.updateAccount.name, error);
        }
    }
    
    
    
    /**
     * Updates the profile image for a specific student.
     * 
     * @param {Object} params - Profile image update parameters
     * @param {number} params.image_id - ID of the image to set as profile
     * @param {number} params.student_id - ID of the student to update
     * @returns {Promise<number>} Number of affected rows (1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async updateProfileImage ({ image_id, student_id }) {
        try {
            const [affectedRows] = await models.Student.update(
                { image_id: image_id }, 
                { where: { student_id: student_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.updateProfileImage.name, error);
        }
    }


    /**
     * Updates any provided student fields dynamically.
     * Only the fields passed in the `fields` object will be updated.
     * 
     * @param {Object} params - Update parameters
     * @param {number} params.student_id - ID of the student to update
     * @param {string} [params.name] - First name
     * @param {string} [params.father_name] - Father's name
     * @param {string} [params.grand_father_name] - Grandfather's name
     * @param {string} [params.family_name] - Family name
     * @param {number} [params.department_id] - Department ID
     * @param {number} [params.account_id] - Linked account ID
     * @param {number} [params.image_id] - Profile image ID
     * @returns {Promise<number>} Number of affected rows (1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async updateStudent({
        student_id,
        name,
        father_name,
        grand_father_name,
        family_name,
        department_id,
        account_id,
        image_id
    }) {
        try {
            const values = {};

            if (name !== undefined) values.student_name = name;
            if (father_name !== undefined) values.student_father_name = father_name;
            if (grand_father_name !== undefined) values.student_grandfather_name = grand_father_name;
            if (family_name !== undefined) values.student_family_name = family_name;
            if (department_id !== undefined) values.department_id = department_id;
            if (account_id !== undefined) values.account_id = account_id;
            if (image_id !== undefined) values.image_id = image_id;

            // إذا لم يتم تمرير أي حقل، لا ننفذ التحديث
            if (Object.keys(values).length === 0) return 0;

            const [affectedRows] = await models.Student.update(values, { 
                where: { student_id } 
            });

            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.updateStudent.name, error);
        }
    }


    
    
    /**
     * Searches for students by name within a specific department.
     * Looks for matches in the student_full_name field.
     * 
     * @param {string} keyword - Search term to look for in student names
     * @param {Object} options - Search options
     * @param {number} options.department_id - Department ID to filter by
     * @returns {Promise<Array>} Array of student objects matching the search criteria
     * @throws {Error} If database operation fails
     */
    static async searchByName(keyword, { department_id }) {
        try {
            const whereOptions = {
                student_full_name: { [Op.like]: `%${keyword}%` },
            };

            if(department_id)
            whereOptions.department_id = department_id;

            const students = await models.Student.findAll({
                where: whereOptions,
                attributes: [ 'student_id', 'student_full_name', ]
            });

            return students;

        } catch (error) {
            throw this.#logger.log(this.searchByName.name, error);
        }
    }

    
    
    /**
     * Retrieves a specific student by their ID.
     * 
     * @param {Object} params - Student retrieval parameters
     * @param {number} params.student_id - ID of the student to retrieve
     * @returns {Promise<Object|null>} Student record if found, null otherwise
     * @throws {Error} If database operation fails
     */
    static async get ({ student_id }) {
        try {
            const student = await models.Student.findOne({ 
                where: { student_id: student_id } 
            });

            return student;

        } catch (error) {
            throw this.#logger.log(this.get.name, error);
        }
    }

    
    
    /**
     * Retrieves all students belonging to a specific department.
     * 
     * @param {Object} params - Department filter parameters
     * @param {number} params.department_id - ID of the department to retrieve students from
     * @returns {Promise<Array>} Array of student records in the specified department
     * @throws {Error} If database operation fails
     */
    static async getByDepartmentStudents ({ department_id }) {
        try {
            const students = await models.Student.findAll({ 
                where: { department_id: department_id } 
            });
            
            return students;

        } catch (error) {
            throw this.#logger.log(this.getByDepartmentStudents.name, error);
        }
    }
    
    
    
    /**
     * Retrieves all students belonging to a specific college by fetching students
     * from all departments within the given college.
     * 
     * @param {Object} params - College filter parameters
     * @param {number} params.collage_id - ID of the college to retrieve students from
     * @returns {Promise<Array>} Array of student records from all departments in the college
     * @throws {Error} If database operation fails
     */
    static async getByCollageID({ collage_id }) {
        try {
            const students = await models.Student.findAll({
                include: [
                    { 
                        model: models.Department, 
                        include: [{ model: models.Collage }], 
                        where: { collage_id: collage_id },
                        required: true
                    }
                    
                ],
            });
            return students;

        } catch (error) {
            throw this.#logger.log(this.getByCollageID.name, error);    
        }
    }
}

module.exports = StudentService;