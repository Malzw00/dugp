async function seedPermissions(models) {

    await models.Permission.bulkCreate([
        
        { permission_id: 'projects',  permission_name: 'إدارة المشاريع وتبعياتها' },
        { permission_id: 'categories',  permission_name: 'إدارة الفئات' },
        { permission_id: 'people',  permission_name: 'إدارة الأشخاص (الطلبة والمشرفين)' },
        { permission_id: 'collages',  permission_name: 'إدارة الكليات والأقسام' },
        { permission_id: 'files',  permission_name: 'إدارة الملفات (الصور والكتب والعروض التقديمية والمراجع)' },
        { permission_id: 'delete_comment',  permission_name: 'حذف تعليق' },
        { permission_id: 'delete_account',  permission_name: 'حذف حساب' },

    ], { ignoreDuplicates: true });
}

module.exports = { seedPermissions };