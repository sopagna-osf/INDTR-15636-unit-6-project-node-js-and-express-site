'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const data = require('./data.json');

const app = express();
const portNumber = 3000;
const { personal_information, portfolio } = data;
const projects = data.projects.map(project => {
    project.main_image = project.image_urls.find(item => item.indexOf('550x550') > -1);
    project.landscape_images = project.image_urls.filter(item => item.indexOf('1200x550') > -1);
    return project;
});

app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { personal_information, portfolio, projects });
});

app.get('/about', (req, res) => {
    res.render('about', { personal_information });
});

app.get('/project/:id', (req, res, next) => {
    const project = projects.find(project => project.id === req.params.id );

    if (!project) {
        const err = new Error('Oops! Nothing was found');
        err.status = 404;
        return next(err);
    }
    
    res.render('project', { personal_information, project });
});

// Error Handler
app.use((req, res, next) => {
    const err = new Error('Oops! Nothing was found');
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    console.log(`${error.message} (${error.status}: ${http.STATUS_CODES[error.status]})`);
    res.status(error.status);
    res.render('error', { error });
});

app.listen(portNumber);
console.log(`This application is listening to port ${portNumber}`);
