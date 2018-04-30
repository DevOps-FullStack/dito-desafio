'use strict';
const timeline = require('express').Router();
const { TimelineController } = require('../controllers');
const timelineController = new TimelineController();

timeline.route('/')
  .get(timelineController.findAll);


module.exports = timeline;

