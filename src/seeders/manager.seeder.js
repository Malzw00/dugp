async function seedManagerAccount(models) {

    await models.Account.findOrCreate({
        where: { account_role: 'manager' },
        defaults: {
            fst_name: 'Platform',
            lst_name: 'Manager',
            account_email: '',
            verified_email: true,
            hashed_password: '$2b$10$eh6stj.j.zCnDUQFEw4YKOS0OUZ1CYge.eucxtIoHRz15tN1jxJ3a', // 0000
            account_role: 'manager',
            profile_image_id: null,
        },
    });
}

module.exports = { seedManagerAccount };