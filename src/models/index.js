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
const PermissionScopeModel = require('@models/permission_scope.model');





/** @param {import('sequelize').Sequelize} sequelize */

module.exports = function initModels(sequelize) {

    const models = {
        Collage: CollageModel(sequelize),
        Image: ImageModel(sequelize),
        Keyword: KeywordModel(sequelize),
        Category: CategoryModel(sequelize),
        Permission: PermissionModel(sequelize),
        Account: AccountModel(sequelize),
        Department: DepartmentModel(sequelize),
        AccountPermission: AccountPermissionModel(sequelize),
        PermissionScope: PermissionScopeModel(sequelize),
        AccountReport: AccountReportModel(sequelize),
        Student: StudentModel(sequelize),
        Supervisor: SupervisorModel(sequelize),
        Project: ProjectModel(sequelize),
        ProjectStudent: ProjectStudentModel(sequelize),
        Rating: RatingModel(sequelize),
        Comment: CommentModel(sequelize),
        ProjectReference: ProjectReferenceModel(sequelize),
        ProjectBook: ProjectBookModel(sequelize),
        ProjectPresentation: ProjectPresentationModel(sequelize),
        ProjectCategory: ProjectCategoryModel(sequelize),
        ProjectKeyword: ProjectKeywordModel(sequelize),
        ProjectLike: ProjectLikeModel(sequelize),
        CommentLike: CommentLikeModel(sequelize),
        ProjectReport: ProjectReportModel(sequelize),
        CommentReport: CommentReportModel(sequelize),
    };


    Object.values(models).forEach(model => {
        
        if(typeof model.associate === 'function')
        model.associate(models);
    });

    return models;
};