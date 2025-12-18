// models/index.js
const AccountModel = require('@models/account.model');
const AccountPermissionModel = require('@models/accountPermission.model');
const AccountReportModel = require('@models/accountReport.model');
const CategoryModel = require('@models/category.model');
const CollageModel = require('@models/collage.model');
const CommentModel = require('@models/comment.model');
const CommentLikeModel = require('@models/commentLike.model');
const CommentReportModel = require('@models/commentReport.model');
const DepartmentModel = require('@models/department.model');
const KeywordModel = require('@models/keyword.model');
const PermissionModel = require('@models/permission.model');
const ProjectModel = require('@models/project.model');
const ProjectCategoryModel = require('@models/projectCategory.model');
const ProjectKeywordModel = require('@models/projectKeyword.model');
const ProjectLikeModel = require('@models/projectLike.model');
const ProjectReportModel = require('@models/projectReport.model');
const ProjectStudentModel = require('@models/projectStudent.model');
const RatingModel = require('@models/rating.model');
const StudentModel = require('@models/student.model');
const SupervisorModel = require('@models/supervisor.model');
const PermissionScopeModel = require('@models/permissionScope.model');
const RefreshTokenModel = require('@models/refreshToken.model');
const ResetPasswordModel = require('@models/resetPassword.model');
const FileModel = require('@models/file.model');
const ProjectReferenceModel = require('@models/projectReference.model');
const ReferenceModel = require('@models/reference.model');




/** @param {import('sequelize').Sequelize} sequelize */

module.exports = function initModels(sequelize) {

    const models = {
        Collage: CollageModel(sequelize),
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
        ProjectCategory: ProjectCategoryModel(sequelize),
        ProjectKeyword: ProjectKeywordModel(sequelize),
        ProjectLike: ProjectLikeModel(sequelize),
        CommentLike: CommentLikeModel(sequelize),
        ProjectReport: ProjectReportModel(sequelize),
        CommentReport: CommentReportModel(sequelize),
        RefreshToken: RefreshTokenModel(sequelize),
        ResetPassword: ResetPasswordModel(sequelize),
        File: FileModel(sequelize),
        ProjectReference: ProjectReferenceModel(sequelize),
        Reference: ReferenceModel(sequelize),
    };


    Object.entries(models).forEach(([name, model]) => {
        // console.log("Associating:", name);
        if (typeof model.associate === 'function') {
            model.associate(models);
        }
    });


    return models;
};



// /** @param {import('sequelize').Sequelize} sequelize */
// module.exports = function initModels(sequelize) {

//     // قائمة التعريفات بصيغة name-> factory (لا تستدعيها مباشرة)
//     const factories = {
//         Collage: CollageModel,
//         Keyword: KeywordModel,
//         Category: CategoryModel,
//         Permission: PermissionModel,
//         Account: AccountModel,
//         Department: DepartmentModel,
//         AccountPermission: AccountPermissionModel,
//         PermissionScope: PermissionScopeModel,
//         AccountReport: AccountReportModel,
//         Student: StudentModel,
//         Supervisor: SupervisorModel,
//         Project: ProjectModel,
//         ProjectStudent: ProjectStudentModel,
//         Rating: RatingModel,
//         Comment: CommentModel,
//         ProjectCategory: ProjectCategoryModel,
//         ProjectKeyword: ProjectKeywordModel,
//         ProjectLike: ProjectLikeModel,
//         CommentLike: CommentLikeModel,
//         ProjectReport: ProjectReportModel,
//         CommentReport: CommentReportModel,
//         RefreshToken: RefreshTokenModel,
//         ResetPassword: ResetPasswordModel,
//         File: FileModel,
//         ProjectReference: ProjectReferenceModel,
//         Reference: ReferenceModel,
//     };

//     const models = {};
//     // استدعاء كل factory داخل try/catch مع لوق واضح
//     for (const [name, factory] of Object.entries(factories)) {
//         try {
//             if (typeof factory !== 'function') {
//                 console.error(`[MODELS INIT] Factory for ${name} is not a function. typeof=${typeof factory}`);
//                 // تعيين placeholder لمنع توقف الكود لاحقًا
//                 models[name] = null;
//                 continue;
//             }
//             console.log(`[MODELS INIT] Creating model: ${name}`);
//             const model = factory(sequelize);
//             if (!model) {
//                 console.error(`[MODELS INIT] Factory ${name} returned falsy:`, model);
//             }
//             models[name] = model;
//             console.log(`[MODELS INIT] Created model: ${name}`);
//         } catch (err) {
//             console.error(`[MODELS INIT] Error creating model ${name}:`, err && err.stack ? err.stack : err);
//             // سجل وحاول الاستمرار — ضع null لتفادي crash لاحق
//             models[name] = null;
//         }
//     }

//     // الآن السند (associations) مع حماية من النماذج الفارغة
//     for (const [name, model] of Object.entries(models)) {
//         console.log(`[MODELS ASSOC] Associating: ${name}`);
//         try {
//             if (model && typeof model.associate === 'function') {
//                 model.associate(models);
//                 console.log(`[MODELS ASSOC] Associated: ${name}`);
//             } else if (!model) {
//                 console.warn(`[MODELS ASSOC] Skipping associate for ${name} because model is null/falsy`);
//             } else {
//                 // لا يوجد associate
//                 // console.log(`[MODELS ASSOC] No associate function for ${name}`);
//             }
//         } catch (err) {
//             console.error(`[MODELS ASSOC] Error associating ${name}:`, err && err.stack ? err.stack : err);
//         }
//     }

//     return models;
// };
