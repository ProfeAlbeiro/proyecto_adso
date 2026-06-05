// backend/nodejs_express/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// ============ RUTAS PÚBLICAS (no requieren autenticación) ============
router.post('/create', userController.register);
router.post('/login', userController.login);

// ============ RUTAS PROTEGIDAS (requieren autenticación) ============

// Listar todos los usuarios - requiere admin o seller
router.get('/', verifyToken, authorizeRoles(['admin', 'seller']), userController.getAllUsers);

// Obtener usuario por ID - requiere admin o seller
router.get('/:id', verifyToken, authorizeRoles(['admin', 'seller']), userController.getUserById);

// ACTUALIZAR usuario - requiere admin o seller (PUT /:id)
router.put('/:id', verifyToken, authorizeRoles(['admin', 'seller']), userController.getUserUpdate);

// ELIMINAR usuario - SOLO admin (DELETE /delete/:id)
router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), userController.getUserDelete);

module.exports = router;