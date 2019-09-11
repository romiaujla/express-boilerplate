require('dotenv').config();
const {NODE_ENV} = require('./config');
const express = require('express');
const morgan = require('morgan');
const cors = require ('cors');
const helmet = require('helmet');
const validateBearerToken = require('./validateMiddleware');
const bookmarkRouter = require('./bookmark-router');
const app = express();
const morganOptions = NODE_ENV === 'production' 
    ? 'tiny' 
    : 'dev';
app.use(morgan(morganOptions));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);

// Uses the bookmark-router;
app.use('/bookmarks', bookmarkRouter);

// Error Handler for an Invalid path
app.use((req, res, next) => {
    if(!res.ok){
        logger.error(`Invalid path: , could not fetch results`);
        return res
            .status(404)
            .send(`Invalid path, could not fetch results`);
    }
    next();
});

// Error Handler for a bad request
app.use((error, req, res, next)=> {
    // Log the error in the info.log
    logger.error(error.message);
    console.log(error);
    return res
        .status(500)
        .json(error);
});
module.exports = app;