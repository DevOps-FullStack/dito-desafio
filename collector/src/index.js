'use strict';
/**
 * Loding resource for config of application
 */
const express = require('express');
const app = express();

/**
 * Loading routers
 */
const { EventRouter, TimelineRouter } = require('./routes');

/**
 * Express middleware native to transform object json to object javascript
 */
app.use(express.static('src/web', { extensions: ['html'] }));
app.use(express.json());

/**
 * Endpoint to resource of event
 */
app.use('/event', EventRouter);

/**
 * Endpoint to resource of timeline
 */
app.use('/timeline', TimelineRouter)

/**
 * Middleware to not found 404
 */
app.use((req, res, next) => {
  res.sendStatus(404);
});

/**
 * Middlware to error application
 */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Sorry, occurred an error!')
});

module.exports = app;