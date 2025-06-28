const express = require('express');
const router = express.Router();

// Lightweight ping route for keep-alive
router.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController'); 
const {permission , can}= require('../middleware/permissionMiddleware');
const permissionController = require('../controllers/permissionController');
const userRoleController = require('../controllers/userRoleController');
const rolePermissionController = require('../controllers/rolePermissionController');
const dashboardController = require('../controllers/dashboardController');

const authorize = require('../middleware/authorizationMiddleware'); 
router.use(authorize);

//const permit = require('../middleware/permissionMiddleware');

// CRUD Routes for User
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getCurrentUser);
router.post('/addUser',  userController.addUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);
router.put('/update-profile', userController.updateProfile);
router.post("/progress", userController.updateProgress);
router.get("/progress/:user_id", userController.getUserProgress);


// Dashboard functions 
router.get('/dashboard/total-users', dashboardController.getTotalusers);
router.get('/dashboard/total-active-users', dashboardController.getTotalActiveusers);
router.get('/dashboard/top-contributors', dashboardController.getTopContributors);
router.get('/dashboard/recently-active-users', dashboardController.getRecentlyActiveusers);
router.get('/dashboard/top-students-progress', dashboardController.getTopStudentsProgressGraph);

// --- Dialects CRUD ---
router.post('/create-dialect', dashboardController.createDialect);
router.get('/dialects', dashboardController.getDialects);
router.get('/dialects/:id', dashboardController.getDialectById);
router.put('/dialects/:id', dashboardController.updateDialect);
router.delete('/dialects/:id', dashboardController.deleteDialect);

// --- Flagged Words ---
router.get('/flagged-words', dashboardController.getFlaggedWords);
router.delete('/flagged-words/:id', dashboardController.deleteFlaggedWord);


// CRUD Routes for Role
router.get('/roles', roleController.getRoles);
router.get('/role/:id', roleController.getRoleById);
router.post('/create-role', roleController.createRole);
router.put('/update-role/:id', roleController.updateRole);
router.delete('/delete-role/:id', roleController.deleteRole);

// CRUD Routes for Permissions
router.get('/permissions', permissionController.getPermissions);
router.get('/permission/:id', permissionController.getPermissionById);
router.post('/create-permission', permissionController.createPermission);
//router.put('/update-permission/:id', permissionController.updatePermission);
//router.delete('/delete-permission/:id', permissionController.deletePermission);

// CRUD Routes for Role Permissions
router.get('/rolePermissions', rolePermissionController.getRolePermission);
router.get('/rolePermission/:id', rolePermissionController.getRolePermissionById);
router.post('/create-rolePermission', rolePermissionController.createRolePermission);
router.put('/update-rolePermission/:id', rolePermissionController.updateRolePermission);
router.delete('/delete-rolePermission/:id', rolePermissionController.deleteRolePermission);

// CRUD Routes for User Roles
router.get('/userRoles', userRoleController.getUserRoles);
router.delete('/delete-userRole/:id', userRoleController.deleteUserRole);



// --- Words CRUD ---
const wordController = require('../controllers/wordController');
router.post('/words', wordController.createWord);
router.get('/words', wordController.getWords);
router.get('/words/:id', wordController.getWord);
router.put('/words/:id', wordController.updateWord);
router.delete('/words/:id', wordController.deleteWord);

// --- Game Progress ---
const gameProgressController = require('../controllers/gameProgressController');
router.post('/game-progress', gameProgressController.upsertProgress);
router.get('/game-progress', gameProgressController.getProgress);
router.post('/game-progress/reset', gameProgressController.resetProgress);

// --- Leaderboard ---
const leaderboardController = require('../controllers/leaderboardController');
router.post('/leaderboard/update', leaderboardController.updateLeaderboard);
router.get('/leaderboard/gameType', leaderboardController.getLeaderboard);
router.get('/leaderboards', leaderboardController.getAllUsersTotalLeaderboard);

// --- Flagging ---
const flaggingController = require('../controllers/flaggingController');
router.post('/flag-content', flaggingController.flagContent);
router.get('/getAll-flagged-contents', flaggingController.getAllFlaggedContents);

//  --- User Progress --- 
const userProgressController = require ('../controllers/userProgressController');
router.get('/userProgress', userProgressController.getAllUserProgress);

module.exports = router;

