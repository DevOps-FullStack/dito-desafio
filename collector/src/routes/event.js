'use strict';
const event = require('express').Router();
const { EventController } = require('../controllers');
const eventController = new EventController();

event.route('/')
  .get(eventController.searchEvent)
  .post(eventController.saveEvent);

module.exports = event;

