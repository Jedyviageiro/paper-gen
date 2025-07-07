const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Basic input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça nome, email e senha.' });
        }

        // 2. Check if user already exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: 'Usuário já existe com este email.'
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user with correct properties
        const newUser = await User.createUser({
            name,
            email,
            password_hash: hashedPassword
        });

        if (!newUser) {
            // This case might occur if database insertion fails for some reason
            return res.status(500).json({ message: 'Erro ao criar o usuário.' });
        }

        // 5. Generate JWT
        const token = jwt.sign({
            userId: newUser.id
        }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        // 6. Send successful response
        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            token: token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
        }

        const user = await User.findUserByEmail(email);

        // Safely compare password, works even if user is null
        const isMatch = user ? await bcrypt.compare(password, user.password_hash) : false;

        if (!isMatch) {
            // Use a generic error message for better security
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // Generate JWT
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        // Send successful response
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};