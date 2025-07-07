const Project = require('../models/projectsModel');
const { buildPrompt } = require('../utils/promptBuilder');
const generatePaper = require('../services/geminiService'); 
const { exportProjectToDocx } = require('../services/exportService');

const createProject = async (req, res) => {
    try {
        const {
            topic,
            tone,
            university,
            student_name,
            professor_name,
            courseName,
            user_id
        } = req.body;

        // 1. Build the Gemini prompt
        const prompt = buildPrompt({
            topic,
            tone,
            university,
            studentName: student_name,
            professorName: professor_name,
            courseName
        });

        // 2. Generate structured content from Gemini (returns a JS object)
        const generatedContent = await generatePaper(prompt);

        // 3. Prepare project object for DB (keys should match DB columns)
        const projectData = {
            user_id,
            title: topic, // Map 'topic' to the 'title' column
            tone,
            university,
            student_name,
            professor_name,
            course_name: courseName,
            generated_content: generatedContent // Pass the JS object directly
        };

        // 4. Save to database
        const newProject = await Project.createProject(projectData);

        if (newProject) {
            res.status(201).json({
                message: 'Projeto criado com sucesso!',
                project: newProject
            });
        } else {
            res.status(400).json({
                message: 'Erro ao criar o projeto. Por favor, tente novamente.'
            });
        }

    } catch (error) {
        console.error('Erro ao criar o projeto:', error);
        res.status(500).json({
            message: 'Erro interno do servidor.',
            error: error.message // Pass the specific error message back
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.updateProject(req.params.id, req.body);
        if (updatedProject) {
            res.status(200).json({
                message: 'Projeto atualizado com sucesso!',
                project: updatedProject
            });
        } else {
            res.status(404).json({
                message: 'Projeto não encontrado.'
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar o projeto:', error);
        res.status(500).json({
            message: 'Erro interno do servidor. Por favor, verifique a sua input e tente novamente.'
        });
    }
}

const getProjectById = async (req, res) => {
    try {
        const project = await Project.getProjectById(req.params.id);
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({
                message: 'Projeto não encontrado.'
            });
        }
    } catch (error) {
        console.error('Erro ao obter o projeto:', error);
        res.status(500).json({
            message: 'Erro interno do servidor. Por favor, tente novamente.'
        });
    }
}

const getProjectByUserId = async (req, res) => {
    try {
        const projects = await Project.getProjectByUserId(req.params.user_id);
        if (projects) {
            res.status(200).json(projects);
        } else {
            res.status(404).json({
                message: 'Nenhum projeto encontrado para este usuário.'
            });
        }
    } catch (error) {
        console.error('Erro ao obter os projetos do usuário:', error);
        res.status(500).json({
            message: 'Erro interno do servidor. Por favor, tente novamente.'
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.deleteProject(req.params.id);
        if (deletedProject) {
            res.status(200).json({
                message: 'Projeto deletado com sucesso!'
            });
        } else {
            res.status(404).json({
                message: 'Projeto não encontrado.'
            });
        }
    } catch (error) {
        console.error('Erro ao deletar o projeto:', error);
        res.status(500).json({
            message: 'Erro interno do servidor. Por favor, tente novamente.'
        });
    }
}

const generatePaperContent = async (req, res) => { 
    try{
        const prompt = buildPrompt(req.body);
        // generatePaper now returns a JS object.
        const generatedObject = await generatePaper(prompt);

        res.status(200).json({
            message: 'Conteúdo gerado com sucesso!',
            content: generatedObject
        });
    } catch (error) {
        console.error('Erro ao gerar o conteúdo do projeto:', error);
        res.status(500).json({
            message: 'Erro interno do servidor.',
            error: error.message
        });
    }
}

const exportProjectDocx = async (req, res) => {
    try {
        const project = await Project.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado.' });
        }

        // Pass all the necessary details for the cover page to the export service
        const filePath = await exportProjectToDocx({
            ...project,
        });

        res.download(filePath); // or stream if you want
    } catch (error) {
        console.error('Erro ao exportar projeto:', error);
        res.status(500).json({ message: 'Erro ao exportar o projeto.' });
    }
};

module.exports = {
    createProject,
    updateProject,
    getProjectById,
    getProjectByUserId,
    deleteProject,
    generatePaperContent,
    exportProjectDocx
};
