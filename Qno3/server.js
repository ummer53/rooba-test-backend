const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const requestLogger = require('./middlewares/requestLogger');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Connection
mongoose.connect('mongodb://localhost:27017/local');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);

// User routes
app.use(userRoutes);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
