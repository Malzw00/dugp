const ServiceError = require("@services/ServiceError");

class CollageService {
    
    
    static async delete({ collage_id }) {

        if(typeof collage_id !== 'number')
        throw new ServiceError(CollageService.name, this.delete.name, {
            type: 'ArgumentTypeError',
            message: ''
        });
            
        try {
            
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new ServiceError("");
            }
        }
    }
}