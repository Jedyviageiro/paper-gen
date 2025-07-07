const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const autenticateToken = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Erro ao verificar o token:', error);
            return res.status(403).json({ message: 'Token inválido.' });
        }
    };

    module.exports = autenticateToken;