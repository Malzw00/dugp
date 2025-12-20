const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");
const { hash, compare } = require('@utils/hash.util');
const AccountService = require('@services/account/account.service');
const { 
    generateAccessToken, 
    verifyRefreshToken,
    buildATPayload,
    generateResetToken,
    buildRPTPayload,
    verifyResetPasswordToken
} = require("@utils/authToken.util");
const { models } = require("@config/database.config");
const EmailUtil = require("@utils/email.util");
const RefreshTokenService = require('@services/account/refrehToken.service');



class AuthService {
    
    static #logger = new ServiceErrorLogger({ module: 'Auth' });

    /**
     * Registers a new user account with the provided details.
     * Validates email uniqueness, hashes the password, and creates the account.
     * 
     * @param {Object} params - Registration parameters
     * @param {string} params.fst_name - User's first name
     * @param {string} params.lst_name - User's last name
     * @param {string} params.account_email - User's email address
     * @param {string} params.password - User's plain text password
     * @returns {Promise<Object>} The created account object
     * @throws {Error} EMAIL_EXISTS if the email is already registered
     * @throws {Error} Other validation or database errors
     */
    static async register({ fst_name, lst_name, account_email, password }) {
        try {
           const emailExists = await AccountService.isEmailExists({ email: account_email });
            if (emailExists) {
                throw new Error('EMAIL_EXISTS');
            }

            const hashedPassword = await hash(password);

            const created = await AccountService.create({
                fst_name,
                lst_name,
                account_email,
                hashed_password: hashedPassword,
            });

            return {
                account_id: created.account_id,
                fst_name: created.fst_name,
                lst_name: created.lst_name,
                account_role: created.account_role,
                updated_at: created.updated_at,
            };

        } catch (error) {
            throw this.#logger.log(this.register.name, error);
        }
    }

    /**
     * Authenticates a user and generates access and refresh tokens upon successful login.
     * Verifies email existence and password validity before issuing tokens.
     * 
     * @param {Object} params - Login parameters
     * @param {string} params.email - User's email address
     * @param {string} params.password - User's plain text password
     * @returns {Promise<Object>} User information and authentication tokens
     * @throws {Error} LOGIN_FAILED if email doesn't exist or password is incorrect
     */
    static async login({ email, password }) {
        try {
            const account = await AccountService.getByEmail({ account_email: email });
            if(!account) throw new Error("LOGIN_FAILED");
         
            const checkPassword = await compare(password, account.hashed_password);

            if (!checkPassword)
            throw new Error("LOGIN_FAILED");
                
            const refreshToken = await RefreshTokenService.create({ account_id: account.account_id });

            const accessToken = generateAccessToken(
                buildATPayload({ 
                    accountID: account.account_id, 
                    accountRole: account.account_role 
                }),
            );

            return {
                account_id:         account.account_id,
                fst_name:           account.fst_name,
                lst_name:           account.lst_name,
                account_role:       account.account_role,
                profile_image_id:   account.profile_image_id,
                accessToken:        accessToken.token,
                refreshToken:       refreshToken.token,
            }

        } catch (error) {
            throw this.#logger.log(this.login.name, error);
        }
    }

    /**
     * Logs out a user by invalidating their refresh token.
     * Verifies the refresh token, finds the associated token record, and deletes it.
     * 
     * @param {Object} params - Logout parameters
     * @param {string} params.refreshToken - The refresh token to invalidate
     * @returns {Promise<boolean>} True if logout was successful
     * @throws {Error} LOGOUT_FAILED if an error occurs during token invalidation
     */
    static async logout({ refreshToken }) {
        try {

            // verify token to get payload and access to account id.
            let account_id = verifyRefreshToken(refreshToken).accountID;

            const accountTokens = await RefreshTokenService.accountTokens(account_id);
            
            if (!accountTokens || accountTokens.length === 0) {
                // There are no tokens for this user, 
                // we are returning success because the goal has been achieved.
                return true;
            }
            
            const tokenToDelete =  await RefreshTokenService.compareHashedTokens({
                hashedRefreshTokens: accountTokens,
                refreshToken: refreshToken,
            });
            
            if (tokenToDelete)
            await RefreshTokenService.deleteByID({ 
                refresh_token_id: tokenToDelete.refresh_token_id 
            });
            
            // If we don't find the token, it may have expired or been previously deleted.
            // We return successful because the ultimate goal (no active token) has been achieved.
            return true;
            
        } catch (error) {
            throw this.#logger.error(this.logout.name, error);
        }
    }

    /**
     * Generates a new access token using a valid refresh token.
     * Verifies refresh token validity, checks expiration, and issues new access token.
     * 
     * @param {Object} params - Token refresh parameters
     * @param {string} params.refreshToken - Valid refresh token
     * @returns {Promise<Object>} New access token
     * @throws {Error} TOKEN_NOT_MATCH if refresh token doesn't match stored tokens
     * @throws {Error} TOKEN_EXPIRED if refresh token has expired
     * @throws {Error} ACCOUNT_NOT_FOUND if associated account doesn't exist
     */
    static async refreshAccessToken({ refreshToken }) {
        try {
            const accountID = verifyRefreshToken(refreshToken).accountID;

            const accountTokens = await RefreshTokenService.accountTokens(accountID);

            const tokenRecord = await RefreshTokenService.compareHashedTokens({
                hashedRefreshTokens: accountTokens,
                refreshToken: refreshToken,
            });

            if(!tokenRecord) 
            throw new Error('TOKEN_NOT_MATCH');

            if(new Date(tokenRecord.expires_at) < new Date())
            throw new Error("TOKEN_EXPIRED");

            // Get account data to ensure the role has not changed.
            const account = await AccountService.getByID({ account_id: accountID });
            if (!account) {
                throw new Error("ACCOUNT_NOT_FOUND");
            }

            return generateAccessToken(
                buildATPayload({
                    accountID:   account.account_id,
                    accountRole: account.account_role
                }),
            )

        } catch (error) {
            throw this.#logger.log(this.refreshAccessToken.name, error);
        }
    }

    /**
     * Initiates a password reset process by generating a reset token and sending it via email.
     * Creates a time-limited reset token and emails it to the user.
     * 
     * @param {Object} params - Password reset request parameters
     * @param {string} params.email - User's email address
     * @returns {Promise<boolean>} True if reset request was processed successfully
     * @throws {Error} EMAIL_NOT_FOUND if no account exists with the provided email
     */
    static async forgetPassword({ email }) {
        try {
            const account = await AccountService.getByEmail({ account_email: email });
           
            if (!account)
            throw new Error("EMAIL_NOT_FOUND");
            
            const { token, expiresAt } = generateResetToken(buildRPTPayload({
                accountID: account.account_id,
            }))

            const hashedToken = await hash(token);

            await models.ResetPassword.create({
                token: hashedToken,
                account_id: account.account_id,
                expires_at: expiresAt,
            });

            const resetLink = `${process.env.SERVER_HOST}/reset-password/token?=${token}`;

            await EmailUtil.send({
                to: email,
                subject: 'Password Reset Requert',
                text: `Use this link to reset your password: ${resetLink}`,
                html: `<p>Click here to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
            });

            return true;
                
        } catch (error) {
            this.#logger.log(this.forgetPassword.name, error);
        }
    }

    /**
     * Resets a user's password using a valid reset token.
     * Verifies the reset token, hashes the new password, and updates the user account.
     * Also cleans up the used reset token from the database.
     * 
     * @param {Object} params - Password reset parameters
     * @param {string} params.resetToken - Valid password reset token
     * @param {string} params.newPassword - New plain text password
     * @returns {Promise<boolean>} True if password was reset successfully
     * @throws {Error} If reset token is invalid or expired
     */
    static async resetPassword ({ resetToken, newPassword }) {
        try {
            const payload = verifyResetPasswordToken(resetToken);
            
            const hashedPassword = await hash(newPassword);

            await models.Account.update(
                { hashed_password: hashedPassword },
                { where: { account_id: payload.accountID } }
            );

            await models.ResetPassword.destroy({
                where: { token: await hash(resetToken) }
            });

            return true;

        } catch (error) {
            throw this.#logger.log(this.resetPassword.name, error);
        }
    }


    /**
     * Retrieves the currently authenticated user's account information.
     * Validates the refresh token, ensures it exists and is not expired,
     * and returns the associated account data.
     * 
     * @param {Object} params - Request parameters
     * @param {string} params.refreshToken - Valid refresh token
     * @returns {Promise<Object>} Authenticated account information
     * @throws {Error} TOKEN_NOT_MATCH if refresh token is invalid
     * @throws {Error} TOKEN_EXPIRED if refresh token has expired
     * @throws {Error} ACCOUNT_NOT_FOUND if account no longer exists
     */
    static async me({ refreshToken }) {
        try {
            // 1 - Verify refresh token signature
            const payload = verifyRefreshToken(refreshToken);
            const accountID = payload.accountID;

            // 2 - Check token existence in database
            const accountTokens = await RefreshTokenService.accountTokens(accountID);

            const tokenRecord = await RefreshTokenService.compareHashedTokens({
                hashedRefreshTokens: accountTokens,
                refreshToken: refreshToken,
            });

            if (!tokenRecord)
                throw new Error('TOKEN_NOT_MATCH');

            // 3 - Check expiration
            if (new Date(tokenRecord.expires_at) < new Date())
                throw new Error('TOKEN_EXPIRED');

            // 4 - Fetch fresh account data
            const account = await AccountService.getByID({ account_id: accountID });
            if (!account)
                throw new Error('ACCOUNT_NOT_FOUND');

            // 5 - Return safe account data
            return {
                account_id:         account.account_id,
                fst_name:           account.fst_name,
                lst_name:           account.lst_name,
                account_email:      account.account_email,
                role:               account.account_role,
                profile_image_id:   account.profile_image_id,
                created_at:         account.created_at,
                updated_at:         account.updated_at,
            };

        } catch (error) {
            throw this.#logger.log(this.me.name, error);
        }
    }

}



module.exports = AuthService;