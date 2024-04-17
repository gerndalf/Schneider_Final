require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware for urlencoded data (form data)
app.use(express.urlencoded({ extended: false }));

// built-in middelware for json
app.use(express.json());

// built-in middleware for serving static files for web pages
app.use(express.static(path.join(__dirname, '/public'))); // Default is '/'

// routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));
// TODO IMPLEMENT THIS
app.use('/states', require('./routes/api/states'));

// Catch all 404 response
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})