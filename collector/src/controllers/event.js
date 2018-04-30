'use strict';
const { request } = require('http');

class EventController {

  /**
   * Method to find event by name   
   */
  searchEvent(req, res, next) {
    let { search } = req.query;

    if (!search)
      return res.sendStatus(204);

    let bodyResquest = JSON.stringify({
      suggest: {
        'events-suggest': {
          prefix: search,
          completion: {
            field: 'event',
            skip_duplicates: true
          }
        }
      }
    });

    let options = {
      hostname: process.env.ELASTICSEARCH_SERVER || 'localhost',
      port: process.env.ELASTICSEARCH_PORT || '9200',
      path: `/dito/_search?filter_path=suggest.events-suggest.options._source.event`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyResquest)
      }
    };

    let requestElasticSearch = request(options, response => {
      let data = '';

      response.on('data', chuck => {
        data += chuck;
      });

      response.on('end', () => {
        data = JSON.parse(data);

        let { suggest } = data;

        if (suggest) {
          let body = [];

          suggest['events-suggest'].forEach(ele => {
            ele.options.forEach(item => {
              let { _source } = item;
              body.push(_source.event);
            });
          });

          res.json(body);
        }
        else
          res.sendStatus(200);
      });
    });

    requestElasticSearch.on('error', next);
    requestElasticSearch.write(bodyResquest);
    requestElasticSearch.end();
  }

  /**
   * Method to save event   
   */
  saveEvent(req, res, next) {
    // object to string
    let body = JSON.stringify(req.body);

    let options = {
      hostname: process.env.ELASTICSEARCH_SERVER || 'localhost',
      port: process.env.ELASTICSEARCH_PORT || '9200',
      path: '/dito/events',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    let requestElasticSearch = request(options, response => {

      response.on('data', () => { });

      response.on('end', () => {
        res.sendStatus(201);
      });
    });

    requestElasticSearch.on('error', next);

    requestElasticSearch.write(body);
    requestElasticSearch.end();
  }

}

module.exports = EventController;