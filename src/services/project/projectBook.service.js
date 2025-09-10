const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

class ProjectBookService {

    static logger = new ServiceErrorLogger({ module: 'ProjectBookService' });


    static async create({ path, project_id }) {

    }


    static async getByProjectID({ project_id }) {
        return null
    }


    static async getByPath({ path }) {
        return null
    }


    static async getByID({ book_id }) {
        return null
    }


    static async delete({ book_id }) {

    }


    static async deleteByProjectID({ project_id, transaction }) {

    }


    static async update({ project_id, path, book_id }) {

    }
}



module.exports = ProjectBookService;