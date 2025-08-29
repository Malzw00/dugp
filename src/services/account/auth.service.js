const LogServiceError = require("@utils/logServiceError.util");
const { models } = require('@config/database.config');

class AuthService {
    
    static logger = new LogServiceError({ module: 'Auth' });

    static async register({ fst_name, lst_name, account_email, password }) {
        try {
            
        } catch (error) {
            throw this.logger.log(this.register.name, error);
        }
    }
}