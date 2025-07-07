const pool = require('../config/db');

const createProject = async ({user_id, topic, tone, generated_content, university, student_name, professor_name, format}) =>{
    const result = await pool.query(
        'INSERT INTO projects (user_id, topic, tone, generated_content, university, student_name, professor_name, format) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [user_id, topic, tone, generated_content, university, student_name, professor_name, format]
    );
    return result.rows[0];
}

const updateProject = async (id, {topic, tone, generated_content, university, student_name, professor_name, format}) => {
    const result = await pool.query(
        'UPDATE projects SET topic = $1, tone = $2, generated_content = $3, university = $4, student_name = $5, professor_name = $6, format = $7 WHERE id = $8 RETURNING *',
        [topic, tone, generated_content, university, student_name, professor_name, format, id]
    );
    return result.rows[0];
}

const getProjectById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM projects WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

const getProjectByUserId = async (user_id) => {
    const result = await pool.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
        [user_id]
    );
    return result.rows;
}

const deleteProject = async (id) => {
    const result = await pool.query(
        'DELETE FROM projects WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
}

module.exports = {
    createProject,
    updateProject,
    getProjectById,
    getProjectByUserId,
    deleteProject
};