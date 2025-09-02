// models/index.js
const AccountModel = require('@models/account.model');
const AccountPermissionModel = require('@models/accountPermission.model');
const AccountReportModel = require('@root/src/models/accountReport.model');
const CategoryModel = require('@models/category.model');
const CollageModel = require('@root/src/models/collage.model');
const CommentModel = require('@models/comment.model');
const CommentLikeModel = require('@root/src/models/commentLike.model');
const CommentReportModel = require('@models/commentReport.model');
const DepartmentModel = require('@models/department.model');
const ImageModel = require('@root/src/models/image.model');
const KeywordModel = require('@models/keyword.model');
const PermissionModel = require('@models/permission.model');
const ProjectModel = require('@models/project.model');
const ProjectBookModel = require('@root/src/models/projectBook.model');
const ProjectCategoryModel = require('@root/src/models/projectCategory.model');
const ProjectKeywordModel = require('@root/src/models/projectKeyword.model');
const ProjectLikeModel = require('@root/src/models/projectLike.model');
const ProjectPresentationModel = require('@root/src/models/projectPresentation.model');
const ProjectReferenceModel = require('@root/src/models/projectReference.model');
const ProjectReportModel = require('@root/src/models/projectReport.model');
const ProjectStudentModel = require('@root/src/models/projectStudent.model');
const RatingModel = require('@models/rating.model');
const StudentModel = require('@models/student.model');
const SupervisorModel = require('@models/supervisor.model');
const PermissionScopeModel = require('@models/permissionScope.model');
const RefreshTokenModel = require('@models/refrehToken.model');
const ResetPasswordModel = require('@models/resetPassword.model');




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
        RefreshToken: RefreshTokenModel(sequelize),
        ResetPassword: ResetPasswordModel(sequelize),
    };


    Object.values(models).forEach(model => {
        
        if(typeof model.associate === 'function')
        model.associate(models);
    });

    return models;
};