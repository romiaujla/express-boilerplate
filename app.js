require('dotenv').config();
const {NODE_ENV} = require('./config');
const express = require('express');
const morgan = require('morgan');
const cors = require ('cors');
const helmet = require('helmet');

const app = express();
const morganOptions = NODE_ENV === 'production' 
    ? 'tiny' 
    : 'common';
app.use(morgan(morganOptions));
app.use(helmet());
app.use(cors());

const basePath = `/`;

app.get(basePath, (_,res)=>{
    res.send(`A GET request`);
});

app.post(basePath, (req, res) => {
    res.send(`A POST request`);
});

module.exports = app;