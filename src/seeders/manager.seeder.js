async function seedManagerAccount(models) {

    await models.Account.findOrCreate({
        where: { account_role: 'manager' },
        defaults: {
            fst_name: 'Platform',
            lst_name: 'Manager',
            account_email: '',
            verified_email: true,
            hashed_password: '$2a$12$pe3jk/8VOnSE663VW2rnW.MwphF5wvbtDGqBXPV4pWVstgvYau07K', // manager_password
            account_role: 'manager',
            profile_image_id: null,
        },
    });
}

module.exports = { seedManagerAccount };