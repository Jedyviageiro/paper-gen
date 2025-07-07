-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- TEXT is more flexible for password hashes
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    topic TEXT,
    tone VARCHAR(50),
    generated_content TEXT,
    university VARCHAR(100),
    student_name VARCHAR(100),
    professor_name VARCHAR(100),
    format VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Optional: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
-- The UNIQUE constraint on users(email) already creates an index automatically.


