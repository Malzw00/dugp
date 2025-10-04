const express           = require('express');
const router            = express.Router();
const accountsRoute     = require('@routes/api/v1/accounts.route');
const authRoute         = require('@routes/api/v1/auth.route');
const collagesRoute     = require('@routes/api/v1/collages.route');
const departmentsRoute  = require('@routes/api/v1/departments.route');
const filesRoute        = require('@routes/api/v1/files.route');
const projectsRoute     = require('@root/src/routes/api/v1/projects/projects.route');
const studentsRoute     = require('@routes/api/v1/students.route');
const supervisorsRoute  = require('@routes/api/v1/supervisors.route');
const commentsRoute     = require('@routes/api/v1/comments.route');
const settingsRoute     = require('@routes/api/v1/settings.route');

router.use('/accounts', accountsRoute);
router.use('/auth', authRoute);
router.use('/collages', collagesRoute);
router.use('/departments', departmentsRoute);
router.use('/files', filesRoute);
router.use('/projects', projectsRoute);
router.use('/students', studentsRoute);
router.use('/supervisors', supervisorsRoute);
router.use('/comments', commentsRoute);
router.use('/settings', settingsRoute);


module.exports = router;