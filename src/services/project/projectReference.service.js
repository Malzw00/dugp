const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

class ProjectReferenceService {

    static logger = new ServiceErrorLogger({ module: 'ProjectReferenceService' });


    static async create({ path, project_id }) {

    }


    static async getByProjectID({ project_id }) {
        return null
    }


    static async getByPath({ path }) {
        return null
    }


    static async getByID({ reference_id }) {
        return null
    }


    static async delete({ reference_id }) {

    }


    static async deleteByProjectID({ project_id, transaction }) {

    }


    static async update({ project_id, path, reference_id }) {

    }
}



module.exports = ProjectReferenceService;