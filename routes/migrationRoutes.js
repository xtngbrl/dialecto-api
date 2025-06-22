const express = require('express');
const router = express.Router();
const migrationController = require('../controllers/migrationController');

const authorize = require('../middleware/authorizationMiddleware'); 
const { permission } = require('../middleware/permissionMiddleware');
router.use(authorize);
// Migration endpoints
router.post('/migrations/up', permission(['Admin']), migrationController.migrateUp);
router.post('/migrations/down', permission(['Admin']), migrationController.migrateDown);
router.post('/migrations/undo-all', permission(['Admin']), migrationController.migrateUndoAll);

// Seeder endpoints
router.post('/seeders/up', permission(['Admin']), migrationController.seedUp);
router.post('/seeders/down', permission(['Admin']), migrationController.seedDown);
router.post('/seeders/undo-all', permission(['Admin']), migrationController.seedUndoAll);

module.exports = router;
