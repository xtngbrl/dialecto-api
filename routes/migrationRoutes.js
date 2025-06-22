const express = require('express');
const router = express.Router();
const migrationController = require('../controllers/migrationController');

const authorize = require('../middleware/authorizationMiddleware'); 
const { permit } = require('../middleware/permissionMiddleware');
router.use(authorize);
// Migration endpoints
router.post('/migrations/up', permit(['Admin']), migrationController.migrateUp);
router.post('/migrations/down', permit(['Admin']), migrationController.migrateDown);
router.post('/migrations/undo-all', permit(['Admin']), migrationController.migrateUndoAll);

// Seeder endpoints
router.post('/seeders/up', permit(['Admin']), migrationController.seedUp);
router.post('/seeders/down', permit(['Admin']), migrationController.seedDown);
router.post('/seeders/undo-all', permit(['Admin']), migrationController.seedUndoAll);

module.exports = router;
