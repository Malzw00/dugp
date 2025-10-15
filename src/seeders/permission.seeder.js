async function seedPermissions(models) {

    await models.Permission.bulkCreate([
        
        /**
         * Project permissions apply to all project dependencies, 
         * including books, presentations, references, student documentation, 
         * supervisor documentation, and keywords.
         */
        { permission_id: 'create_project',  permission_name: 'اضافة مشروع او احد تبعياته' },
        { permission_id: 'delete_project',  permission_name: 'حذف مشروع او احد تبعياته' },
        { permission_id: 'update_project',  permission_name: 'تحديث بيانات مشروع او بيانات احد تبعياته' },

        { permission_id: 'create_category',  permission_name: 'انشاء فئة' },
        { permission_id: 'delete_category',  permission_name: 'حذف فئة' },
        { permission_id: 'update_category',  permission_name: 'تحديث فئة' },

        { permission_id: 'create_project_image',  permission_name: 'رفع صورة غلاف مشروع' },
        { permission_id: 'delete_project_image',  permission_name: 'حذف صورة غلاف مشروع' },
        { permission_id: 'update_project_image',  permission_name: 'تحديث صورة غلاف مشروع' },

        { permission_id: 'delete_comment',  permission_name: 'حذف تعليق' },
        
        { permission_id: 'delete_account',  permission_name: 'حذف حساب' },

        { permission_id: 'update_role',  permission_name: 'تحديث دور حساب' },
        
        { permission_id: 'delete_account_image',  permission_name: 'حذف صورة حساب' },
        
        { permission_id: 'read_account_report',  permission_name: 'عرض بلاغ حساب' },
        { permission_id: 'delete_account_report',  permission_name: 'حذف بلاغ حساب' },
        
        { permission_id: 'read_project_report',  permission_name: 'عرض بلاغ حساب' },
        { permission_id: 'delete_project_report',  permission_name: 'حذف بلاغ مشروع' },
        
        { permission_id: 'read_comment_report',  permission_name: 'عرض بلاغ تعليق' },
        { permission_id: 'delete_comment_report',  permission_name: 'حذف بلاغ تعليق' },

        { permission_id: 'account_permissions',  permission_name: 'إدارة صلاحيات الحسابات' },
        
    ], { ignoreDuplicates: true });
}

module.exports = { seedPermissions };





// { permission_name: 'create_book' },
// { permission_name: 'delete_book' },
// { permission_name: 'update_book' },

// { permission_name: 'create_presentation' },
// { permission_name: 'delete_presentation' },
// { permission_name: 'update_presentation' },

// { permission_name: 'create_reference' },
// { permission_name: 'delete_reference' },
// { permission_name: 'update_reference' },

// { permission_name: 'create_keyword' },
// { permission_name: 'delete_keyword' },
// { permission_name: 'update_keyword' },

// { permission_name: 'create_student' },
// { permission_name: 'delete_student' },
// { permission_name: 'update_student' },

// { permission_name: 'create_supervisor' },
// { permission_name: 'delete_supervisor' },
// { permission_name: 'update_supervisor' },