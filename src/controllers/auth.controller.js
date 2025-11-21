/**
 * @module AuthController
 * @description Controller handling authentication and account-related operations
 * such as login, registration, token refresh, and password management.
 */

const AuthService = require("@services/account/auth.service");
const { RefreshTokenExpIn } = require('@utils/authToken.util');

const authController = {

    /**
     * @async
     * @function login
     * @description Authenticates a user by verifying credentials and generating tokens.
     * @route POST /api/auth/login
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing:
     *  - `req.body.email` {string} - The user's email address.
     *  - `req.body.password` {string} - The user's password.
     * @param {import("express").Response} res - Express response object.
     * 
     * @returns {Promise<void>} Sends a JSON response with account details and tokens if successful.
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Authenticate and return tokens
            const account = await AuthService.login({ email, password });

            if (account?.account_id) {
                // --- Here we send a refresh token via cookie ---
                res.cookie("refresh_token", account.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: RefreshTokenExpIn * 1000,
                    path: "/api/v1/auth/refresh", // Excellent for safety if you place it on a specific path.
                });

                // We only send access token and data
                res.status(200).json({
                    success: true,
                    result: {
                        account_id: account.account_id,
                        fst_name: account.fst_name,
                        lst_name: account.lst_name,
                        role: account.role,
                        accessToken: account.accessToken,
                    },
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Login failed due to a server error.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function register
     * @description Creates a new user account with the provided details.
     * @route POST /api/auth/register
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing:
     *  - `req.body.fstname` {string} - First name.
     *  - `req.body.lstname` {string} - Last name.
     *  - `req.body.email` {string} - Email address.
     *  - `req.body.password` {string} - Account password.
     * @param {import("express").Response} res - Express response object.
     * 
     * @returns {Promise<void>} Sends a success response when registration is successful.
     */
    async register(req, res) {
        try {
            const { fstname, lstname, email, password } = req.body;

            const createdAccount = await AuthService.register({
                fst_name: fstname,
                lst_name: lstname,
                account_email: email,
                password,
            });

            if (createdAccount?.account_id) {
                res.status(201).json({
                    success: true,
                    message: "Account created successfully.",
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Failed to create account.",
                });
            }
        } catch (error) {
            if (error.message === "EMAIL_EXISTS") {
                res.status(409).json({
                    success: false,
                    message: "This email is already registered.",
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Registration failed due to a server error.",
                    error: error.message,
                });
            }
        }
    },

    /**
     * @async
     * @function logout
     * @description Logs out the current user by invalidating their refresh token.
     * @route POST /api/auth/logout
     * @access Authenticated users
     * 
     * @param {import("express").Request} req - Express request object containing `req.user.refreshToken`.
     * @param {import("express").Response} res - Express response object.
     * 
     * @returns {Promise<void>} Sends a JSON response confirming logout success.
     */
    async logout(req, res) {
        try {
            const { refreshToken } = req.user;

            const isLogout = await AuthService.logout({ refreshToken });

            if (isLogout) {
                // Clear the cookie
                res.clearCookie("refresh_token", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/api/v1/auth/refresh",
                });

                return res.status(200).json({ success: true });
            }

            return res.status(400).json({
                success: false,
                message: "Failed to log out. Invalid or expired token.",
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Logout failed due to invalid data.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function forgetPassword
     * @description Initiates the password reset process by sending a reset link to the user's email.
     * @route POST /api/auth/forgot-password
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing `req.body.email`.
     * @param {import("express").Response} res - Express response object.
     * 
     * @returns {Promise<void>} Sends a JSON response confirming the reset email was sent.
     */
    async forgetPassword(req, res) {
        try {
            const { email } = req.body;

            const done = await AuthService.forgetPassword({ email });

            if (done) {
                res.status(200).json({
                    success: true,
                    message: "Check your email to reset your password.",
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Email not found or invalid request.",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to send password reset email.",
                error: error.message,
            });
        }
    },

    /**
     * @async
     * @function resetPassword
     * @description Resets the user password using a valid reset token.
     * @route POST /api/auth/reset-password
     * @access Public
     * 
     * @param {import("express").Request} req - Express request object containing:
     *  - `req.body.token` {string} - Reset token.
     *  - `req.body.newPassword` {string} - New password.
     * @param {import("express").Response} res - Express response object.
     * 
     * @returns {Promise<void>} Sends a JSON response indicating password reset status.
     */
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            const done = await AuthService.resetPassword({
                resetToken: token,
                newPassword,
            });

            if (done) {
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Invalid or expired reset token.",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to reset password.",
                error: error.message,
            });
        }
    },

    /**
     * @async
     * @function refresh
     * @description Generates a new access token using a valid refresh token.
     * @route POST /api/auth/refresh
     * @access Authenticated users
     * 
     * @param {import("express").Request} req - Express request object containing `req.user.refreshToken`.
     * @param {import("express").Response} res - Express response object.
     * 
     * @returns {Promise<void>} Sends a JSON response with a new access token.
     */
    async refresh(req, res) {
        try {
            // Read refresh token from cookies directly
            const refreshToken = req.cookies?.refresh_token;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token missing.",
                });
            }

            const newAccessToken = await AuthService.refreshAccessToken({ refreshToken });

            if (newAccessToken) {
                return res.status(200).json({
                    success: true,
                    accessToken: newAccessToken,
                });
            }

            return res.status(400).json({
                success: false,
                message: "Invalid or expired refresh token.",
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to refresh access token.",
                error: error.message,
            });
        }
    }
};

module.exports = authController;