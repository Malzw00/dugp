const AccountService = require("@services/account/account.service");

const accountController = {

    /**
     * @async
     * @function getByID
     * @description Retrieves an account by its unique ID.
     * @route GET /api/accounts/:accountId
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing `accountId` in the route params.
     * @param {import("express").Response} res - Express response object used to return JSON results.
     * 
     * @returns {Promise<void>} Sends a JSON response containing the account details.
     * 
     * @example
     * // Example Request:
     * GET /api/accounts/10
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": {
     *     "account_id": 10,
     *     "fst_name": "Ali",
     *     "lst_name": "Omar",
     *     "account_email": "ali.omar@example.com",
     *     "profile_image_id": 5
     *   }
     * }
     */
    async getByID(req, res) {
        try {
            const { accountId } = req.params;
            const accountIdNum = parseInt(accountId);

            if (isNaN(accountIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid accountId parameter.",
                });
            }

            const account = await AccountService.getByID({ account_id: accountIdNum });

            res.status(200).json({
                success: true,
                result: account,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve account information.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function getMe
     * @description Retrieves the currently authenticated user’s account data.
     * @route GET /api/accounts/me
     * @access Protected (requires authentication)
     * 
     * @param {import("express").Request} req - Express request containing authenticated `user` object.
     * @param {import("express").Response} res - Express response object used to send JSON data.
     * 
     * @returns {Promise<void>} Sends a JSON response containing the authenticated user's account details.
     * 
     * @example
     * // Example Request:
     * GET /api/accounts/me
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": {
     *     "account_id": 7,
     *     "fst_name": "Sara",
     *     "lst_name": "Mohamed",
     *     "account_email": "sara.m@example.com",
     *     "profile_image_id": 3
     *   }
     * }
     */
    async getMe(req, res) {
        try {
            const { user } = req;
            const accountIdNum = parseInt(user.accountID);
            const account = await AccountService.getByID({ account_id: accountIdNum });

            res.status(200).json({
                success: true,
                result: account,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve current user info.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function deleteByID
     * @description Deletes an account by its ID.
     * @route DELETE /api/accounts/:accountId
     * @access Admin Only
     * 
     * @param {import("express").Request} req - Express request object containing the `accountId` parameter.
     * @param {import("express").Response} res - Express response object used to return a JSON confirmation.
     * 
     * @returns {Promise<void>} Sends a success response if the account is deleted successfully.
     * 
     * @example
     * // Example Request:
     * DELETE /api/accounts/10
     * 
     * // Example Response:
     * {
     *   "success": true
     * }
     */
    async deleteByID(req, res) {
        try {
            const { accountId } = req.params;
            const accountIdNum = parseInt(accountId);

            if (isNaN(accountIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid accountId parameter.",
                });
            }

            await AccountService.delete({ account_id: accountIdNum });

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete account.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function deleteMe
     * @description Deletes the authenticated user’s account.
     * @route DELETE /api/accounts/me
     * @access Protected (requires authentication)
     * 
     * @param {import("express").Request} req - Express request object containing authenticated `user`.
     * @param {import("express").Response} res - Express response object used to return success state.
     * 
     * @returns {Promise<void>} Sends a success JSON response upon deletion.
     * 
     * @example
     * // Example Request:
     * DELETE /api/accounts/me
     * 
     * // Example Response:
     * {
     *   "success": true
     * }
     */
    async deleteMe(req, res) {
        try {
            const { user } = req;
            const accountIdNum = parseInt(user.accountID);
            await AccountService.delete({ account_id: accountIdNum });

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete current account.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function updateMe
     * @description Updates the authenticated user's account information.
     * @route PUT /api/accounts/me
     * @access Protected (requires authentication)
     * 
     * @param {import("express").Request} req - Express request containing `user` and updated account data in `body`.
     * @param {import("express").Response} res - Express response object used to return the operation result.
     * 
     * @returns {Promise<void>} Sends a success JSON response after the account is updated.
     * 
     * @example
     * // Example Request:
     * PUT /api/accounts/me
     * {
     *   "fstname": "Ali",
     *   "lstname": "Khaled",
     *   "accountEmail": "ali.khaled@example.com",
     *   "imageId": 8
     * }
     * 
     * // Example Response:
     * {
     *   "success": true
     * }
     */
    async updateMe(req, res) {
        try {
            const { user } = req;
            const { accountID } = user;
            const { fstname, lstname, accountEmail, imageId } = req.body;

            const accountIdNum = parseInt(accountID);
            const imageIdNum = parseInt(imageId);

            await AccountService.update({
                account_id: accountIdNum,
                account_email: accountEmail,
                fst_name: fstname,
                lst_name: lstname,
                profile_image_id: imageIdNum,
            });

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update account.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function search
     * @description Searches for accounts by partial name match, with optional pagination.
     * @route GET /api/accounts/search?keyword={name}&limit={n}&offset={n}
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing search query parameters.
     * @param {import("express").Response} res - Express response object used to return search results.
     * 
     * @returns {Promise<void>} Returns a list of matching accounts in JSON format.
     * 
     * @example
     * // Example Request:
     * GET /api/accounts/search?keyword=ali&limit=10&offset=0
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": [
     *     { "account_id": 1, "fst_name": "Ali", "lst_name": "Ahmed" },
     *     { "account_id": 2, "fst_name": "Ali", "lst_name": "Omar" }
     *   ]
     * }
     */
    async search(req, res) {
        try {
            const { keyword, limit, offset } = req.query;
            const limitNum = parseInt(limit);
            const offsetNum = parseInt(offset);

            const accounts = await AccountService.searchByName({
                keyword,
                offset: offsetNum,
                limit: limitNum,
            });

            res.status(200).json({
                success: true,
                result: accounts,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to search accounts.",
                error: error.message,
            });
        }
    },
};

module.exports = accountController;