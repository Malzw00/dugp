const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

class ProjectPresentationService {

    static logger = new ServiceErrorLogger({ module: 'ProjectPresentationService' });


    static async create({ path, project_id }) {

    }


    static async getByProjectID({ project_id }) {
        return null
    }


    static async getByPath({ path }) {
        return null
    }


    static async getByID({ presentation_id }) {
        return null
    }


    static async delete({ presentation_id }) {

    }


    static async deleteByProjectID({ project_id, transaction }) {

    }


    static async update({ project_id, path, presentation_id }) {

    }
}



module.exports = ProjectPresentationService;