const express           = require('express');
const router            = express.Router();
const accountsRoute     = require('@root/src/routes/api/v1/account.routes');
const adminsRoute       = require('@root/src/routes/api/v1/admin.routes');
const authRoute         = require('@root/src/routes/api/v1/auth.routes');
const collagesRoute     = require('@root/src/routes/api/v1/collage.routes');
const filesRoute        = require('@root/src/routes/api/v1/file.routes');
const projectsRoute     = require('@root/src/routes/api/v1/projects/project.routes');
const studentsRoute     = require('@root/src/routes/api/v1/student.routes');
const supervisorsRoute  = require('@root/src/routes/api/v1/supervisor.routes');
const commentsRoute     = require('@root/src/routes/api/v1/comment.routes');
const settingsRoute     = require('@root/src/routes/api/v1/setting.routes');

router.use('/accounts', accountsRoute);
router.use('/admins', adminsRoute);
router.use('/auth', authRoute);
router.use('/collages', collagesRoute);
router.use('/files', filesRoute);
router.use('/projects', projectsRoute);
router.use('/students', studentsRoute);
router.use('/supervisors', supervisorsRoute);
router.use('/comments', commentsRoute);
router.use('/settings', settingsRoute);


module.exports = router;