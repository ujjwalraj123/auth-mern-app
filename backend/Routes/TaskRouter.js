const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const {
  createTask,
  updateTask,
  deleteTask,
  markTaskAsDone,
  getTasks // <- Add this
} = require('../Controllers/TaskController');
const { taskCreateValidation, taskUpdateValidation } = require('../Middlewares/TaskValidation');

// 👇 Add this line
router.get('/', ensureAuthenticated, getTasks);

router.post('/create', ensureAuthenticated, taskCreateValidation, createTask);
router.put('/:taskId', ensureAuthenticated, taskUpdateValidation, updateTask);
router.delete('/:taskId', ensureAuthenticated, deleteTask);
router.patch('/:taskId/done', ensureAuthenticated, markTaskAsDone);

module.exports = router;
