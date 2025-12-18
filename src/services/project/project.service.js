const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");
const { models, sequelize } = require("@config/database.config");
const { fn, col, Op, literal } = require("sequelize");
const FileService = require("@root/src/services/File.service");



/**
 * @class ProjectService
 * @classdesc Service layer for managing Project entities in the database.  
 * Provides methods for CRUD operations, searching, filtering, and managing project-related files.
 * 
 * 📌 **General Notes:**
 * - Uses Sequelize ORM with model associations.
 * - Includes filtering, pagination, and ordering.
 * - Related entities: Categories, Department → Collage, Students, Supervisor, Files.
 */
class ProjectService {
    
    static #logger = new ServiceErrorLogger({ module: 'ProjectService' });

    /**
     * Create a new project in the database.
     *
     * This method inserts a new project record with the provided details.
     * It requires the project title, description, academic year, semester, department, and supervisor.
     *
     * @param {Object} params - Parameters for creating the project.
     * @param {string} params.title - The title of the project.
     * @param {string} params.description - The description of the project.
     * @param {string|number} params.date - The academic date for the project.
     * @param {'Winter'|'Spring'|'Summer'|'Autumn'} params.semester - The semester of the project.
     * @param {number} params.department_id - The ID of the department associated with the project.
     * @param {number} params.supervisor_id - The ID of the supervisor for the project.
     * @returns {Promise<import('sequelize').Model>} The created project instance.
     * @throws {AppError} Throws an error if creation fails.
     */
    static async create({ title, description, date, semester, department_id, supervisor_id }) {
        try {
            const created = await models.Project.create({
                project_title: title,
                project_description: description,
                project_date: date,
                project_semester: semester,
                department_id,
                supervisor_id
            });
            return created;
        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }


    /**
     * Update an existing project's details.
     *
     * Only the fields provided (non-undefined) will be updated.
     * This allows partial updates without overwriting other fields.
     *
     * @param {Object} params - Parameters for updating the project.
     * @param {number} params.project_id - The ID of the project to update.
     * @param {string} [params.title] - New title of the project.
     * @param {string} [params.description] - New description of the project.
     * @param {string} [params.date] - New project date.
     * @param {string} [params.semester] - New semester value.
     * @param {number} [params.grade] - New grade value.
     * @param {number} [params.department_id] - New department ID.
     * @param {number} [params.cover_image_id] - New cover image file ID.
     * @param {number} [params.supervisor_id] - New supervisor ID.
     * @param {boolean} [params.available] - Update availability status.
     * @returns {Promise<number>} Number of affected rows (should be 1 if update succeeded).
     * @throws {AppError} Throws an error if the update fails.
     */
    static async update({ 
        project_id, title, description, date, semester, 
        grade, department_id, cover_image_id, supervisor_id, available 
    }) {
        try {
            const values = {};

            if (title !== undefined) values.project_title = title;
            if (description !== undefined) values.project_description = description;
            if (date !== undefined) values.project_date = date;
            if (semester !== undefined) values.project_semester = semester;
            if (grade !== undefined) values.project_grade = grade;
            if (department_id !== undefined) values.department_id = department_id;
            if (cover_image_id !== undefined) values.cover_image_id = cover_image_id;
            if (supervisor_id !== undefined) values.supervisor_id = supervisor_id;
            if (available !== undefined) values.available = available;

            const [affectedRows] = await models.Project.update(
                values,
                { where: { project_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.update.name, error);
        }
    }


    /**
     * Update the availability status of a project.
     *
     * @param {Object} params - Parameters for updating availability.
     * @param {number} params.project_id - The ID of the project to update.
     * @param {boolean} params.available - New availability status.
     * @returns {Promise<number>} Number of affected rows (should be 1 if update succeeded).
     * @throws {AppError} Throws an error if the update fails.
     */
    static async updateAvailable({ project_id, available }) {
        try {
            const [affectedRows] = await models.Project.update(
                { available },
                { where: { project_id } }
            );
            return affectedRows;
        } catch (error) {
            throw this.#logger.log(this.updateAvailable.name, error);
        }
    }


    /**
     * Retrieve a project by its ID.
     *
     * This method fetches the project along with its associated Students, Supervisor, Cover file, Department, and Collage.
     *
     * @param {Object} params - Parameters for fetching the project.
     * @param {number} params.project_id - The ID of the project to retrieve.
     * @returns {Promise<import('sequelize').Model|null>} The project instance if found, otherwise null.
     * @throws {AppError} Throws an error if fetching fails.
     */
    static async get({ project_id }) {
        try {
            const project = await models.Project.findByPk(
                project_id, 
                {
                    include: [
                        { 
                            model: models.Student, 
                            attributes: [
                                'student_id', 
                                'student_full_name'
                            ] 
                        },
                        { 
                            model: models.Supervisor, 
                            attributes: [
                                'supervisor_id', 
                                'supervisor_full_name',
                                'supervisor_title',
                            ] 
                        },
                        { 
                            model: models.File,
                            attributes: [
                                'file_id', 
                                'original_name', 
                                'stored_name', 
                                'path'
                            ],
                            as: 'Cover', 
                        },
                        { 
                            model: models.Department,
                            include: { 
                                model: models.Collage,
                                as: 'Collage',
                                attributes: ['collage_id','collage_name'], 
                            } 
                        },
                        {
                            model: models.Keyword,
                            attributes: ['keyword'],
                            as: 'Keywords'
                        },
                        {
                            model: models.Category,
                            attributes: ['category_id', 'collage_id', 'category_name']
                        }
                    ]
                }
            );
            return project;
        } catch (error) {
            throw this.#logger.log(this.get.name, error);
        } 
    }

    /**
     * Retrieve projects with pagination, filtering, and sorting options
     * @param {Object} options - Filtering and pagination options
     * @param {number} [options.limit=10] - Number of projects per page
     * @param {number} [options.offset=0] - Offset for pagination
     * @param {number[]} [options.categories] - Array of category IDs to filter by
     * @param {number} [options.departmentId] - Department ID to filter by
     * @param {number} [options.collageId] - Collage ID to filter by
     * @param {string} [options.sortBy='date'] - Field to sort by (date, likes, rate)
     * @param {string} [options.order='DESC'] - Sort order (ASC or DESC)
     * @returns {Promise<Object>} Object containing projects and total count
     */
    static async getAll(options = {}) {
        const {
            offset = 0,
            limit = 10,
            categories,
            departmentId,
            collageId,
            sortBy = 'date',
            order = 'DESC',
            semester,
        } = options;

        try {
            // Build where conditions
            const where = {};
            
            if (departmentId) {
                where.department_id = departmentId;
            }

            // Handle collage filter separately
            if (collageId && !departmentId) {
                // Find all departments in this collage
                const departments = await models.Department.findAll({
                    where: { collage_id: collageId },
                    attributes: ['department_id']
                });
                
                const departmentIds = departments.map(d => d.department_id);
                where.department_id = { [Op.in]: departmentIds };
            }

            if (semester) {
                where.project_semester = semester;
            }

            // Handle category filter
            let includeCategories = [];
            if (categories && categories.length > 0) {
                includeCategories = [{
                    model: models.Category,
                    as: 'Categories',
                    through: { attributes: [] },
                    attributes: [],
                    where: {
                        category_id: { [Op.in]: categories }
                    },
                    required: true
                }];
            }


            // Determine order based on sortBy
            let orderClause;
            switch (sortBy) {
                case 'date':
                    orderClause = [['project_date', order.toUpperCase()]];
                    break;
                // بالنسبة لـ likes و rate، سنرتب بعد الحصول على النتائج
                default:
                    orderClause = [['project_date', order.toUpperCase()]];
            }

            const projects = await models.Project.findAll({
                where,
                include: includeCategories,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: orderClause
            });

            // Enrich projects with stats
            const enrichedProjects = await Promise.all(
                projects.map(async (project) => {
                    // Get counts and ratings
                    const likesCount = await models.ProjectLike.count({
                        where: { project_id: project.project_id }
                    });

                    const commentsCount = await models.Comment.count({
                        where: { project_id: project.project_id }
                    });

                    const ratings = await models.Rating.findAll({
                        where: { project_id: project.project_id },
                        attributes: [[sequelize.fn('AVG', sequelize.col('rate')), 'average']],
                        raw: true
                    });

                    const averageRating = ratings[0]?.average 
                        ? parseFloat(ratings[0].average).toFixed(2)
                        : null;

                    return {
                        project_id: project.project_id,
                        project_title: project.project_title,
                        project_description: project.project_description,
                        project_date: project.project_date,
                        project_semester: project.project_semester,
                        available: project.available,
                        stats: {
                            likes: likesCount,
                            comments: commentsCount,
                            rating: averageRating
                        }
                    };
                })
            );

            // Apply sorting for likes and rate
            if (sortBy === 'likes' || sortBy === 'rate') {
                enrichedProjects.sort((a, b) => {
                    let valueA, valueB;
                    
                    if (sortBy === 'likes') {
                        valueA = a.stats.likes;
                        valueB = b.stats.likes;
                    } else if (sortBy === 'rate') {
                        valueA = a.stats.rating ? parseFloat(a.stats.rating) : 0;
                        valueB = b.stats.rating ? parseFloat(b.stats.rating) : 0;
                    }
                    
                    if (order.toUpperCase() === 'ASC') {
                        return valueA - valueB;
                    } else {
                        return valueB - valueA;
                    }
                });
            }

            // Get total count
            const totalCount = await models.Project.count({
                where,
                include: includeCategories.length > 0 ? includeCategories : [],
                distinct: true
            });

            return {
                projects: enrichedProjects,
                pagination: {
                    total: totalCount,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
                }
            };

        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }


    // Alternative optimized version using raw SQL for better performance
    static async getAllProjectsOptimized(options = {}) {
        const {
            limit = 10,
            offset = 0,
            categories,
            departmentId,
            collageId,
            sortBy = 'project_date',
            order = 'DESC'
        } = options;

        try {
            // Start building the SQL query
            let query = `
                SELECT 
                    p.project_id as id,
                    p.project_title as title,
                    p.project_description as description,
                    p.project_date as date,
                    p.available,
                    COUNT(DISTINCT pl.project_like_id) as likes_count,
                    COUNT(DISTINCT c.comment_id) as comments_count,
                    COALESCE(AVG(r.rate), 0) as average_rating
                FROM projects_tb p
                LEFT JOIN project_likes_tb pl ON p.project_id = pl.project_id
                LEFT JOIN comments_tb c ON p.project_id = c.project_id
                LEFT JOIN ratings_tb r ON p.project_id = r.project_id
                LEFT JOIN departments_tb d ON p.department_id = d.department_id
            `;

            const whereConditions = [];
            const queryParams = [];

            // Add category filter if provided
            if (categories && categories.length > 0) {
                query += `
                    LEFT JOIN project_categories_tb pc ON p.project_id = pc.project_id
                `;
                whereConditions.push(`pc.category_id IN (${categories.map(() => '?').join(',')})`);
                queryParams.push(...categories);
            }

            // Add department filter
            if (departmentId) {
                whereConditions.push('p.department_id = ?');
                queryParams.push(departmentId);
            }

            // Add collage filter
            if (collageId) {
                query += `
                    LEFT JOIN collages_tb col ON d.collage_id = col.collage_id
                `;
                whereConditions.push('col.collage_id = ?');
                queryParams.push(collageId);
            }

            // Add WHERE clause if there are conditions
            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }

            // Group by project
            query += ` GROUP BY p.project_id `;

            // Add sorting
            const orderMap = {
                'project_date': 'p.project_date',
                'likes_count': 'likes_count',
                'average_rating': 'average_rating'
            };

            const orderField = orderMap[sortBy] || 'p.project_date';
            query += ` ORDER BY ${orderField} ${order.toUpperCase()} `;

            // Add pagination
            query += ` LIMIT ? OFFSET ?`;
            queryParams.push(parseInt(limit), parseInt(offset));

            // Execute the query
            const [projects] = await sequelize.query(query, {
                replacements: queryParams,
                type: sequelize.QueryTypes.SELECT
            });

            // Get total count for pagination
            let countQuery = `
                SELECT COUNT(DISTINCT p.project_id) as total
                FROM projects_tb p
                LEFT JOIN departments_tb d ON p.department_id = d.department_id
            `;

            const countConditions = [];
            const countParams = [];

            if (categories && categories.length > 0) {
                countQuery += ` LEFT JOIN project_categories_tb pc ON p.project_id = pc.project_id `;
                countConditions.push(`pc.category_id IN (${categories.map(() => '?').join(',')})`);
                countParams.push(...categories);
            }

            if (departmentId) {
                countConditions.push('p.department_id = ?');
                countParams.push(departmentId);
            }

            if (collageId) {
                countQuery += ` LEFT JOIN collages_tb col ON d.collage_id = col.collage_id `;
                countConditions.push('col.collage_id = ?');
                countParams.push(collageId);
            }

            if (countConditions.length > 0) {
                countQuery += ` WHERE ${countConditions.join(' AND ')}`;
            }

            const [countResult] = await sequelize.query(countQuery, {
                replacements: countParams,
                type: sequelize.QueryTypes.SELECT
            });

            // Format the response
            const formattedProjects = projects.map(project => ({
                project_id: project.id,
                project_title: project.title,
                project_description: project.description,
                project_date: project.date,
                available: project.available,
                stats: {
                    likes: parseInt(project.likes_count) || 0,
                    comments: parseInt(project.comments_count) || 0,
                    rating: parseFloat(project.average_rating).toFixed(2)
                }
            }));

            return {
                projects: formattedProjects,
                pagination: {
                    total: parseInt(countResult.total),
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    hasMore: (parseInt(offset) + parseInt(limit)) < parseInt(countResult.total)
                }
            };

        } catch (error) {
            console.error('Error fetching projects (optimized):', error);
            return {
                success: false,
                error: 'Failed to fetch projects',
                details: error.message
            };
        }
    }


    /**
     * Ordering options for search results.
     * 
     * @typedef {Object} OrderOptions
     * @property {'date'|'rating'|'likes'|'grade'} by - The field used for ordering:
     * - `'date'`: project creation date (`created_at`)
     * - `'rating'`: average project rating
     * - `'likes'`: total likes count
     * - `'grade'`: project grade
     * @property {'ASC'|'DESC'} dir - Sorting direction (ascending or descending).
     */

    /**
     * Search result object for each project.
     * 
     * @typedef {Object} SearchResult
     * @property {number} project_id - Unique project identifier.
     * @property {string} project_title - Project title.
     * @property {string} project_description - Project description.
     * @property {string} project_date - Project date (YYYY-MM-DD).
     * @property {string} project_semester - Academic semester of the project.
     * @property {number} project_grade - Project grade.
     * @property {string} created_at - Timestamp when the project was created.
     * @property {number} rating - Average rating (calculated from `Ratings`).
     * @property {number} likes_count - Number of likes.
     * @property {number} comment_count - Number of comments.
     * @property {{ file_id: number }|null} Cover - Cover file object (if exists).
     * @property {{ keyword: string }[]} Keywords - Associated keywords.
     * @property {{ category_id: number }[]} Categories - Associated categories.
     * @property {{ department_id: number }|null} Department - Associated department.
     * @property {{ collage_id: number }|null} Collage - Associated collage (optional).
     */

    /**
     * Search projects in the database using text, filters, ordering, and pagination.
     *
     * Features:
     * - Full-text search across project title, description, and keywords.
     * - Filters: department, collage, semester, date, grade, keywords, categories.
     * - Statistics: likes count, average ratings, comments count.
     * - Sorting by date, rating, likes, or grade.
     *
     * @param {Object} params - Search parameters.
     * @param {string} [params.searchText=''] - Text query for full-text search.
     * @param {number} [params.offset=0] - Pagination offset.
     * @param {number} [params.limit=10] - Maximum number of results.
     * 
     * @returns {Promise<SearchResult[]>} List of projects with their details and aggregated stats.
     */
    static async search({ searchText = '', offset = 0, limit = 10 }) {
        try {
            const { Op } = require('sequelize');
            
            // تأكد من وجود searchText
            if (!searchText || !searchText.trim()) {
                return [];
            }
            
            const escapedText = sequelize.escape(searchText.trim());
            
            // الطريقة المثلى مع علاقة M:N
            const projects = await models.Project.findAll({
                where: {
                    [Op.or]: [
                        // البحث في حقول المشروع
                        sequelize.literal(`
                            MATCH(Project.project_title, Project.project_description) 
                            AGAINST(${escapedText} IN NATURAL LANGUAGE MODE)
                        `),
                        // البحث في الكلمات المفتاحية عبر العلاقة M:N
                        sequelize.literal(`(
                            SELECT COUNT(*) 
                            FROM keywords_tb AS k
                            INNER JOIN project_keywords_tb AS pk ON k.keyword_id = pk.keyword_id
                            WHERE pk.project_id = Project.project_id
                            AND MATCH(k.keyword) AGAINST(${escapedText} IN NATURAL LANGUAGE MODE)
                        ) > 0`),
                        {
                            project_title: {
                                [Op.like]: `%${searchText.trim()}%`
                            }
                        },
                        {
                            project_description: {
                                [Op.like]: `%${searchText.trim()}%`
                            }
                        }
                    ]
                },
                attributes: [
                    'project_id', 
                    'project_title',
                    'updated_at',
                    // حساب درجة الصلة من المشروع
                    [
                        sequelize.literal(`(
                            MATCH(Project.project_title, Project.project_description) 
                            AGAINST(${escapedText} IN NATURAL LANGUAGE MODE)
                        )`),
                        'project_relevance'
                    ],
                    // حساب درجة الصلة من الكلمات المفتاحية
                    [
                        sequelize.literal(`(
                            SELECT COALESCE(MAX(
                                MATCH(k.keyword) AGAINST(${escapedText} IN NATURAL LANGUAGE MODE)
                            ), 0)
                            FROM keywords_tb AS k
                            INNER JOIN project_keywords_tb AS pk ON k.keyword_id = pk.keyword_id
                            WHERE pk.project_id = Project.project_id
                        )`),
                        'keyword_relevance'
                    ]
                ],
                offset,
                limit,
                // ترتيب حسب مجموع درجات الصلة
                order: [
                    [
                        sequelize.literal('(COALESCE(project_relevance, 0) + COALESCE(keyword_relevance, 0))'),
                        'ASC'
                    ],
                    ['createdAt', 'ASC']
                ],
                subQuery: false,
                distinct: true // مهم جداً مع JOINs
            });

            return projects;
        
        } catch (error) {
            this.#logger.log(this.search, error);
        }
    }


    /**
     * Deletes a project along with its associated files (book, presentation, references) and related data.
     * Comments, likes, ratings, and reports are deleted automatically via ON DELETE CASCADE.
     * Students associated with the project are not deleted.
     *
     * @param {Object} params
     * @param {number} params.project_id - The ID of the project to delete
     * @returns {Promise<{ isDeleted: boolean, deletedFiles: number }>} Result of the deletion
     * @throws {Error} Throws an error if deletion fails
     */
    static async delete({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, { 
                include: [
                    {
                        model: models.File,
                        as: 'References',
                        attributes: ['file_id'],
                        through: { attributes: [] },
                    }
                ],
                transaction: _transaction 
            });

            if (!project) {
                await _transaction.rollback();
                return { isDeleted: false, deletedFiles: 0 };
            }
            
            const fileIds = [
                project.book_id, 
                project.presentation_id,
                ...project.References.map(ref => ref.file_id),
            ].filter(Boolean);

            const deletedFiles = await FileService.bulkDeleteFiles(fileIds, _transaction);

            await project.destroy({ transaction: _transaction });

            await _transaction.commit();

            return { isDeleted: true, deletedFiles };

        } catch (error) {
            await _transaction.rollback();
            throw this.#logger.log(this.delete.name, error);
        }
    }


    /**
     * Associate a book file with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @param {number} params.file_id - ID of the file to set as the book.
     * @returns {Promise<number>} Number of affected rows (1 if updated, 0 otherwise).
     * @throws {AppError} Throws if update fails.
     */
    static async setBook({ project_id, file_id }) {
        try {
            const [affectedRows] = await models.Project.update(
                { book_id: file_id },
                { where: { project_id } }
            );

            return affectedRows;
        } catch (error) {
            throw this.#logger.log(this.setBook.name, error);
        }
    }

    /**
     * Delete the book associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<boolean>} True if deletion was successful, false if no book exists.
     * @throws {AppError} Throws if deletion fails.
     */
    static async deleteBook({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Book',
                    required: false,
                    attributes: [ 'file_id' ],
                    where: { category: 'book' },
                },
                transaction: _transaction,
            });

            if(!project?.Book) {
                await _transaction.rollback();
                return false;
            }

            const deleted = await FileService.deleteFile(
                project.Book.file_id, 
                { transaction: _transaction }
            );

            await _transaction.commit();

            return deleted;
        } catch (error) {
            await _transaction.rollback();
            throw this.#logger.log(this.deleteBook.name, error);
        }
    }

    /**
     * Get the book file associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<Object|null>} File instance if exists, otherwise null.
     * @throws {AppError} Throws if fetching fails.
     */
    static async getBook({ project_id }) {
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Book',
                    where: { category: 'book' },
                    required: false,
                }
            });
            return project?.Book?? null;
        } catch (error) {
            throw this.#logger.log(this.getBook.name, error);
        }
    }

    /**
     * Get the presentation file associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<Object|null>} File instance if exists, otherwise null.
     * @throws {AppError} Throws if fetching fails.
     */
    static async getPresentation({ project_id }) {
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Presentation',
                    where: { category: 'presentation' },
                    required: false,
                }
            });
            return project?.Presentation?? null;
        } catch (error) {
            throw this.#logger.log(this.getPresentation.name, error);
        }
    }

    /**
     * Associate a presentation file with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @param {number} params.file_id - ID of the file to set as the presentation.
     * @returns {Promise<number>} Number of affected rows (1 if updated, 0 otherwise).
     * @throws {AppError} Throws if update fails.
     */
    static async setPresentation({ project_id, file_id }) {
        try {
            const [affectedRows] = await models.Project.update(
                { presentation_id: file_id },
                { where: { project_id } }
            );

            return affectedRows;
        } catch (error) {
            throw this.#logger.log(this.setPresentation.name, error);
        }
    }

    /**
     * Delete the presentation file associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<boolean>} True if deletion was successful, false if no presentation exists.
     * @throws {AppError} Throws if deletion fails.
     */
    static async deletePresentation({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Presentation',
                    required: false,
                    attributes: [ 'file_id' ],
                    where: { category: 'presentation' },
                },
                transaction: _transaction,
            });

            if(!project?.Presentation) {
                _transaction.rollback();
                return false
            }

            const deleted = await FileService.deleteFile(project.Presentation.file_id, { 
                transaction: _transaction 
            });

            await _transaction.commit();

            return deleted;

        } catch (error) {
            await _transaction.rollback();
            throw this.#logger.log(this.deletePresentation.name, error);
        }
    }

    /**
     * Get the cover image associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<Object|null>} File instance if exists, otherwise null.
     * @throws {AppError} Throws if fetching fails.
     */
    static async getCover({ project_id }) {
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Cover',
                    where: { category: 'cover' },
                    required: false,
                }
            });
            return project?.Cover ?? null;
        } catch (error) {
            throw this.#logger.log(this.getCover.name, error);
        }
    }

    /**
     * Associate a cover image file with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @param {number} params.file_id - ID of the file to set as the cover.
     * @returns {Promise<number>} Number of affected rows (1 if updated, 0 otherwise).
     * @throws {AppError} Throws if update fails.
     */
    static async setCover({ project_id, file_id }) {
        try {
            const [affectedRows] = await models.Project.update(
                { cover_image_id: file_id },
                { where: { project_id } }
            );
            return affectedRows;
        } catch (error) {
            throw this.#logger.log(this.setCover.name, error);
        }
    }

    /**
     * Delete the cover image associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<boolean>} True if deletion was successful, false if no cover exists.
     * @throws {AppError} Throws if deletion fails.
     */
    static async deleteCover({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Cover',
                    where: { category: 'cover' },
                    required: false,
                    attributes: ['file_id']
                },
                transaction: _transaction,
            });

            if (!project?.Cover) {
                await _transaction.rollback();
                return false;
            }

            const deleted = await FileService.deleteFile(project.Cover.file_id, { transaction: _transaction });

            await _transaction.commit();
            return deleted;

        } catch (error) {
            await _transaction.rollback();
            throw this.#logger.log(this.deleteCover.name, error);
        }
    }

}


module.exports = ProjectService;