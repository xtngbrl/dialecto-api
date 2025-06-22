const express = require('express');
const router = express.Router();
const migrationController = require('../controllers/migrationController');

// Migration endpoints
router.post('/migrations/up', migrationController.migrateUp);
router.post('/migrations/down', migrationController.migrateDown);
router.post('/migrations/undo-all', migrationController.migrateUndoAll);

// Seeder endpoints
router.post('/seeders/up', migrationController.seedUp);
router.post('/seeders/down', migrationController.seedDown);
router.post('/seeders/undo-all', migrationController.seedUndoAll);

module.exports = router;
