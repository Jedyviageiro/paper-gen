// the imports needed
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routers/authRoutes');
const projectRoutes = require('./routers/projectRoutes');
const cors = require('cors');

//Initializing the app
const app = express();

//loading environment variables
dotenv.config();

//Middleware
app.use(cors()); //Making sure the app accepts reqs from any origin, in this case the frontend
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

//Starting the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`We're good to go! Paper-Gen Listening on port ${PORT} Good studies :)`);
});

