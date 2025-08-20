// models/index.js
const AccountModel = require('@models/account.model');
const AccountPermissionModel = require('@models/account_permission.model');
const AccountReportModel = require('@models/account_report.model');
const CategoryModel = require('@models/category.model');
const CollageModel = require('@root/src/models/collage.model');
const CommentModel = require('@models/comment.model');
const CommentLikeModel = require('@models/comment_like.model');
const CommentReportModel = require('@models/comment_report.model');
const DepartmentModel = require('@models/department.model');
const ImageModel = require('@root/src/models/image.model');
const KeywordModel = require('@models/keyword.model');
const PermissionModel = require('@models/permission.model');
const ProjectModel = require('@models/project.model');
const ProjectBookModel = require('@models/project_book.model');
const ProjectCategoryModel = require('@models/project_category.model');
const ProjectKeywordModel = require('@models/project_keyword.model');
const ProjectLikeModel = require('@models/project_like.model');
const ProjectPresentationModel = require('@models/project_presentation.model');
const ProjectReferenceModel = require('@models/project_reference.model');
const ProjectReportModel = require('@models/project_report.model');
const ProjectStudentModel = require('@models/project_student.model');
const RatingModel = require('@models/rating.model');
const StudentModel = require('@models/student.model');
const SupervisorModel = require('@models/supervisor.model');





/** @param {import('sequelize').Sequelize} sequelize */

module.exports = function initModels(sequelize) {

    const models = {
        Account: AccountModel(sequelize),
        AccountPermission: AccountPermissionModel(sequelize),
        AccountReport: AccountReportModel(sequelize),
        Category: CategoryModel(sequelize),
        Collage: CollageModel(sequelize),
        Comment: CommentModel(sequelize),
        CommentLike: CommentLikeModel(sequelize),
        CommentReport: CommentReportModel(sequelize),
        Department: DepartmentModel(sequelize),
        Image: ImageModel(sequelize),
        Keyword: KeywordModel(sequelize),
        Permission: PermissionModel(sequelize),
        Project: ProjectModel(sequelize),
        ProjectBook: ProjectBookModel(sequelize),
        ProjectCategory: ProjectCategoryModel(sequelize),
        ProjectKeyword: ProjectKeywordModel(sequelize),
        ProjectLike: ProjectLikeModel(sequelize),
        ProjectPresentation: ProjectPresentationModel(sequelize),
        ProjectReference: ProjectReferenceModel(sequelize),
        ProjectReport: ProjectReportModel(sequelize),
        ProjectStudent: ProjectStudentModel(sequelize),
        Rating: RatingModel(sequelize),
        Student: StudentModel(sequelize),
        Supervisor: SupervisorModel(sequelize),
    };


    Object.values(models).forEach(model => {
        
        if(typeof model.associate === 'function')
        model.associate(models);
    });

    return models;
};