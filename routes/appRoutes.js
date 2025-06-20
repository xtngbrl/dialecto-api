const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController'); 
const {permission , can}= require('../middleware/permissionMiddleware');
const permissionController = require('../controllers/permissionController');
const userRoleController = require('../controllers/userRoleController');
const rolePermissionController = require('../controllers/rolePermissionController');

/*const authorize = require('../middleware/authorizationMiddleware'); 
router.use(authorize);*/

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
router.get('/leaderboard', leaderboardController.getLeaderboard);

module.exports = router;

