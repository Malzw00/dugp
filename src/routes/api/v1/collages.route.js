const express = require('express');
const router  = express.Router();


// offset, limit
router.get('/', );

router.get('/:collageId', );

// permission: Admin Has a permission
// query param: collageName
router.post('/', );

// permission: Admin Has a permission
router.delete('/:collageId', );

// permission: Admin Has a permission
// query param: collageName 
router.put('/:collageId', );

router.get('/:collageId/departments', );

router.get('/:collageId/departments/:departmentId', );

router.get('/:collageId/departments/:index', );

// إنشاء وإضافة قسم إلى كلية
// query param: departmentName
router.post('/:collageId/departments', );

// إزالة وحذف
router.delete('/:collageId/departments/:departmentId', );

// query param: departmentName
router.put(':collageId/departments/:departmentId')


module.exports = router;