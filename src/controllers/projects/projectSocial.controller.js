const CommentService = require("@services/social/comment.service");
const ProjectLikeService = require("@services/social/projectLike.service");
const RatingService = require("@services/social/rating.service");

const projectSocialController = {

    /**
     * @async
     * @function getAllLikes
     * @description Retrieves all likes associated with a specific project, with optional pagination using query parameters `limit` and `offset`.
     * @route GET /api/projects/:projectId/likes
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing `projectId` in params and pagination options in query.
     * @param {import("express").Response} res - Express response object used to return the JSON response.
     * 
     * @returns {Promise<void>} Returns a JSON response containing a paginated list of likes for the given project.
     */
    async getAllLikes(req, res) {
        try {
            const { limit, offset } = req.query;
            const { projectId } = req.params;

            // Convert parameters to numbers safely
            const projectIdNum = parseInt(projectId);
            const offsetNum = parseInt(offset);
            const limitNum = parseInt(limit);

            // Fetch likes from service
            const likes = await ProjectLikeService.getProjectLikes({
                project_id: projectIdNum,
                limit: limitNum,
                offset: offsetNum,
            });

            // Return response
            res.status(200).json({
                success: true,
                result: likes,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project likes.",
                
            });
        }
    },


    /**
     * @async
     * @function getLikesCount
     * @description Retrieves the total number of likes for a specific project by its ID.
     * @route GET /api/projects/:projectId/likes/count
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing `projectId` in params.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response containing the total likes count for the specified project.
     */
    async getLikesCount(req, res) {
        try {
            const { projectId } = req.query;

            // Retrieve likes count from service
            const likesCount = await ProjectLikeService.getProjectLikesCount({
                project_id: parseInt(projectId) || null,
            });

            // Return the count in a success response
            res.status(200).json({
                success: true,
                result: likesCount,
            });

        } catch (error) {
            // Internal Server Error
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project likes count.",
                
            });
        }
    },


    /**
     * @async
     * @function amILike
     * @description Checks if the authenticated user has liked a specific project.
     * @route GET /api/projects/:projectId/likes/me
     * @access Protected (requires authentication)
     * 
     * @param {import("express").Request} req - Express request object containing the authenticated user and `projectId` parameter.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response indicating whether the user liked the project.
     */
    async amILike(req, res) {
        try {
            const { user } = req;
            const { projectId } = req.query;

            const projectIdNum = parseInt(projectId);

            // Check if user liked the project
            const amILike = await ProjectLikeService.hasLike({
                project_id: projectIdNum,
                account_id: user.accountID,
            });

            // Return boolean result
            res.status(200).json({
                success: true,
                result: amILike,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to check like status.",
                
            });
        }
    },


    /**
     * @async
     * @function addLike
     * @description Adds a like to a project by the authenticated user.
     * @route POST /api/projects/:projectId/likes
     * @access Protected (requires authentication)
     * 
     * @param {import("express").Request} req - Express request object containing the user and projectId.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response with the created like record.
     */
    async like(req, res) {
        try {
            const { user } = req;
            const { projectId } = req.body;

            const projectIdNum = parseInt(projectId);

            // Create like record (if not already exists)
            const created = await ProjectLikeService.toggle({
                project_id: projectIdNum,
                account_id: user.accountID,
            });

            res.status(201).json({
                success: true,
                result: created, // { result: affectedRows|Object, hasLike: boolean }
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Failed to add like.",
                
            });
        }
    },


    /**
     * @async
     * @function removeLike
     * @description Removes a like from a project by the authenticated user.
     * @route DELETE /api/projects/:projectId/likes
     * @access Protected (requires authentication)
     * 
     * @param {import("express").Request} req - Express request object containing the user and projectId.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response indicating success and number of deleted rows.
     */
    async removeLike(req, res) {
        try {
            const { user } = req;
            const { projectId } = req.params;

            const projectIdNum = parseInt(projectId);

            // Delete like record
            const deleted = await ProjectLikeService.delete({
                project_id: projectIdNum,
                account_id: user.accountID,
            });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Like not found or already removed.",
                });
            }

            res.status(200).json({
                success: true,
                result: deleted,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove like.",
                
            });
        }
    },


    /**
     * @async
     * @function getAllComments
     * @description Retrieves all comments associated with a specific project, with optional pagination support via query parameters `limit` and `offset`.
     * @route GET /api/projects/:projectId/comments
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing `projectId` in params and pagination options in query.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response containing a list of comments for the specified project.
     */
    async getAllComments(req, res) {
        try {
            const { projectId } = req.params;
            const { offset, limit } = req.query;

            // Convert values to numbers safely
            const projectIdNum = parseInt(projectId);
            const offsetNum = parseInt(offset);
            const limitNum = parseInt(limit);

            // Validate input
            if (!projectIdNum || isNaN(projectIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId parameter.",
                });
            }

            // Fetch comments from service
            const comments = await CommentService.getProjectComments({
                project_id: projectIdNum,
                limit: limitNum,
                offset: offsetNum,
            });

            // Return success response
            res.status(200).json({
                success: true,
                result: comments,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project comments.",
                
            });
        }
    },
    
    /**
     * @async
     * @function getCommentsCount
     * @description Retrieves the total number of comments associated with a specific project.
     * @route GET /api/projects/:projectId/comments/count
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing the `projectId` in params.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response containing the number of comments for the given project.
     */
    async getCommentsCount(req, res) {
        try {
            const { projectId } = req.params;
            const projectIdNum = parseInt(projectId);

            // Validate projectId
            if (!projectIdNum || isNaN(projectIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId parameter.",
                });
            }

            // Fetch total comments count
            const commentsCount = await CommentService.getProjectCommentsCount({
                project_id: projectIdNum,
            });

            // Return result
            res.status(200).json({
                success: true,
                result: commentsCount,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project comments count.",
                
            });
        }
    },

    /**
     * @async
     * @function addComment
     * @description Adds a new comment to a specific project by the authenticated user.
     * @route POST /api/projects/:projectId/comments
     * @access Authenticated users
     * 
     * @param {import("express").Request} req - Express request object containing:
     *  - `req.user.accountID`: ID of the currently authenticated user.
     *  - `req.params.projectId`: ID of the target project.
     *  - `req.body.content`: The content of the comment.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response containing the created comment record.
     */
    async addComment(req, res) {
        try {
            const { user } = req;
            const { projectId } = req.params;
            const { content } = req.body;

            const projectIdNum = parseInt(projectId);

            // Validate user and project ID
            if (!user?.accountID || !projectId || isNaN(projectIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user or project ID.",
                });
            }

            if (!content || typeof content !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Comment content is required and must be a string.",
                });
            }

            const created = await CommentService.create({
                project_id: projectIdNum,
                account_id: user.accountID,
                comment_content: content.trim(),
            });

            res.status(201).json({
                success: true,
                result: created,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to add comment.",
                
            });
        }
    },


    /**
     * @async
     * @function removeComment
     * @description Deletes a specific comment by its unique identifier.
     * @route DELETE /api/comments/:commentId
     * @access Authenticated users (comment owner or admin)
     * 
     * @param {import("express").Request} req - Express request object containing `commentId` in params.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response indicating success and the number of deleted records.
     */
    async removeComment(req, res) {
        try {
            const { commentId } = req.params;
            const { accountID } = req.user

            const accountIdNum = parseInt(accountID);
            const commentIdNum = parseInt(commentId);

            const deleted = await CommentService.deleteUserComment({
                comment_id: commentIdNum,
                account_id: accountIdNum,
            });

            res.status(200).json({
                success: true,
                result: deleted,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove comment.",
                
            });
        }
    },


    
    /**
     * @method getAllRatings
     * @description Retrieve all ratings for a specific project with optional pagination.
     * Fetches the list of user ratings associated with a given project, including support for limit and offset.
     * 
     * @route GET /projects/:projectId/ratings
     * @access Any authenticated user (public endpoint if allowed)
     * 
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * 
     * @query {number} [limit] - Maximum number of ratings to return.
     * @query {number} [offset] - Number of records to skip.
     * 
     * @returns {Object} JSON response containing the list of ratings.
     * @returns {boolean} success - Indicates whether the operation was successful.
     * @returns {Array<Object>} result - List of ratings.
     */
    async getAllRatings(req, res) {
        try {
            const { projectId } = req.params;
            const { offset, limit } = req.query;

            const projectIdNum = parseInt(projectId);
            const offsetNum = offset ? parseInt(offset) : 0;
            const limitNum = limit ? parseInt(limit) : 20;

            const ratings = await RatingService.getProjectRatings({ 
                project_id: projectIdNum, 
                offset: offsetNum,
                limit: limitNum,
            });

            res.status(200).json({
                success: true,
                result: ratings,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project ratings.",
                
            });
        }
    },


    /**
     * @method getRatingAverage
     * @description Retrieve the average rating for a specific project.
     * Calculates and returns the average rating value of all user ratings associated with the given project.
     * 
     * @route GET /projects/:projectId/ratings/average
     * @access Any authenticated user (public endpoint if allowed)
     * 
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * 
     * @returns {Object} JSON response containing the average rating.
     * @returns {boolean} success - Indicates whether the operation was successful.
     * @returns {number|null} result - The average rating value or null if there are no ratings.
     */
    async getRatingAverage(req, res) {
        try {
            const { projectId } = req.query;

            const projectIdNum = parseInt(projectId);

            const averageRating = await RatingService.getProjectRating({
                project_id: projectIdNum,
            });

            res.status(200).json({
                success: true,
                result: averageRating,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve project average rating.",
                
            });
        }
    },

    
    /**
     * @method getMyRating
     * @description Retrieve the current user's rating for a specific project.
     * Returns the rating value that the authenticated user previously submitted for the given project.
     * 
     * @route GET /projects/:projectId/ratings/me
     * @access Authenticated users only
     * 
     * @param {Request} req - Express request object containing user and project ID.
     * @param {Response} res - Express response object.
     * 
     * @returns {Object} JSON response with the user's rating or null if not rated yet.
     */
    async getMyRating(req, res) {
        try {
            const { projectId } = req.params;
            const { user } = req;

            const projectIdNum = parseInt(projectId);

            const rating = await RatingService.getAccountProjectRating({
                project_id: projectIdNum,
                account_id: user.accountID,
            });

            res.status(200).json({
                success: true,
                result: rating.rate,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve your project rating.",
                
            });
        }
    },

    /**
     * @method rateProject
     * @description Submit a new rating for a specific project by the authenticated user.
     * Creates a new record in the ratings table associated with the project and user.
     * 
     * @route POST /projects/:projectId/ratings
     * @access Authenticated users only
     * 
     * @body {number} rate - The rating value (e.g., from 1 to 5).
     * 
     * @returns {Object} JSON response with the created rating record.
     */
    async rateProject(req, res) {
        try {
            const { projectId, rate } = req.body;
            const { user } = req;

            const projectIdNum = parseInt(projectId);
            const rateNum = parseInt(rate);

            const created = await RatingService.rate({
                project_id: projectIdNum,
                account_id: user.accountID,
                rate: rateNum,
            });

            res.status(201).json({
                success: true,
                result: created,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to rate the project.",
                
            });
        }
    },

    /**
     * @method updateRating
     * @description Update an existing rating for a specific project by the authenticated user.
     * If the user has already rated the project, this endpoint modifies the rating value.
     * 
     * @route PUT /projects/:projectId/ratings
     * @access Authenticated users only
     * 
     * @body {number} rate - The new rating value (e.g., from 1 to 5).
     * 
     * @returns {Object} JSON response with the updated rating record.
     */
    async updateRating(req, res) {
        try {
            const { rate, projectId } = req.body;
            const { user } = req;

            const projectIdNum = parseInt(projectId);
            const rateNum = parseInt(rate);

            const updated = await RatingService.update({
                project_id: projectIdNum,
                account_id: user.accountID,
                rate: rateNum,
            });

            res.status(200).json({
                success: true,
                result: updated,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update the project rating.",
                
            });
        }
    },
}

module.exports = projectSocialController;