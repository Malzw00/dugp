const { hash, compare } = require("@utils/hash.util");
const { generateRefreshToken, buildRTPayload } = require("@utils/authToken.util");
const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");

class RefreshTokenService {

    static #logger = new ServiceErrorLogger({ module: 'RefreshToken' });

    static async create ({ account_id }) {
        try {
            const refreshToken = generateRefreshToken(
                buildRTPayload({ accountID: account_id }),
            );
            
            const hashedRefreshToken = await hash(refreshToken.token);
            
            await models.RefreshToken.create({
                token: hashedRefreshToken,
                account_id: account_id,
                expires_at: refreshToken.expiresAt,
            });

            return refreshToken;

        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }


    static async deleteByID({ refresh_token_id }) {
        try {
            const deletedRows = await models.RefreshToken.destroy({
                where: { refresh_token_id: refresh_token_id }
            });
            
            return deletedRows;

        } catch (error) {
            throw this.#logger.log(this.deleteByID.name, error);
        }
    }


    static async accountTokens(account_id) {
        try {
            // Find the token associated with the account
            const accountTokens = await models.RefreshToken.findAll({
                where: { account_id: account_id }, raw: true
            });

            return accountTokens;

        } catch (error) {
            throw this.#logger.log('GET_ACCOUNT_TOKENS_FAILED', error)
        }
    }

    static async compareHashedTokens({ hashedRefreshTokens = [], refreshToken }) {
        try {
            for (const tokenRecord of hashedRefreshTokens) {

                const isMatch = await compare(refreshToken, tokenRecord.token);
                
                if (isMatch) 
                return tokenRecord;
            }
            return null;
        } catch (error) {
            throw this.#logger.log('COMPARE_TOKENS_FAILES', error)
        }
    }
}



module.exports = RefreshTokenService;