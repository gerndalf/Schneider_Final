const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        // TODO Log this to a file
        console.error(err);
    }
};

module.exports = connectDB;