const express = require('express');
const Router = express.Router();
const ProjectController = require('../controllers/projectsController');

// Since this router is mounted at '/api/projects', these paths are relative to that.
// For example, this route will be POST /api/projects/
Router.post('/', ProjectController.createProject);

// This route will be GET /api/projects/user/:user_id
Router.get('/user/:user_id', ProjectController.getProjectByUserId);

// Routes for a specific project by its ID
Router.get('/:id', ProjectController.getProjectById);
Router.put('/:id', ProjectController.updateProject);
Router.delete('/:id', ProjectController.deleteProject);
Router.post('/:id/generate', ProjectController.generatePaperContent);
Router.get('/:id/export', ProjectController.exportProjectDocx);

module.exports = Router;