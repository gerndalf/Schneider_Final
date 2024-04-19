// 3rd party middleware
const whitelist = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'https://dazzling-snickerdoodle-777101.netlify.app'
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { //!origin is dev use only
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;