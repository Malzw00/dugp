async function seedPermissions(models) {

    await models.Permission.bulkCreate([
        
        /**
         * Project permissions apply to all project dependencies, 
         * including books, presentations, references, student documentation, 
         * supervisor documentation, and keywords.
         */
        { permission_name: 'create_project' },
        { permission_name: 'delete_project' },
        { permission_name: 'update_project' },

        { permission_name: 'create_category' },
        { permission_name: 'delete_category' },
        { permission_name: 'update_category' },
        

        { permission_name: 'create_project_image' },
        { permission_name: 'delete_project_image' },
        { permission_name: 'update_project_image' },

        { permission_name: 'delete_comment' },

        { permission_name: 'delete_account' },
        
        { permission_name: 'delete_account_image' },

        { permission_name: 'delete_account_report' },

        { permission_name: 'delete_project_report' },
        
        { permission_name: 'delete_comment_report' },

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