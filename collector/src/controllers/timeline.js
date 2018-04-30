'use strict';
const { get } = require('https');
const url = 'https://storage.googleapis.com/dito-questions/events.json';

// Retorna valor do custom_data
function findCustomData(customData, field) {
  let item = customData.find(item =>
    item.key === field
  );
  return item.value;
}

// Monta o object timeline
function formatTimeline(body = []) {
  let timeline = new Map();

  if (body.length > 0)
    body.forEach(ele => {
      //verifica o tipo de evento
      if (ele.event === 'comprou') {

        let transactionId = findCustomData(ele['custom_data'], 'transaction_id');

        let storeName = findCustomData(ele['custom_data'], 'store_name');

        // cria o elemento timeline
        let item = {
          timestamp: ele.timestamp,
          revenue: ele.revenue,
          'transaction_id': transactionId,
          'store_name': storeName,
          products: []
        };

        // adiciona na collection Map
        timeline.set(transactionId, item);
      } else if (ele.event === 'comprou-produto') {
        let transactionId = findCustomData(ele['custom_data'], 'transaction_id');

        //verifica se já recebeu o evento comprar para esta transactionId
        if (timeline.has(transactionId)) {
          let item = timeline.get(transactionId);

          let productName = findCustomData(ele['custom_data'], 'product_name');

          let productValue = findCustomData(ele['custom_data'], 'product_price');

          item.products.push(
            {
              name: productName,
              price: productValue
            }
          );
        }
      }
    });

  // Transforma Collection Map para um Array
  let result = Array.from(timeline, value => value[1]);

  // Ordenação decrescente com base no timestamp do evento comprou
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return { timeline: result };
}

class TimelineController {

  findAll(req, res, next) {

    get(url, response => {
      let data = '';

      response
        .on('data', chuck => data += chuck)
        .on('end', () => {
          try {
            data = JSON.parse(data);
          } catch (err) {
            next(err);
          }

          let { events } = data;

          if (events) {
            let body = formatTimeline(events);
            res.json(body);
          } else
            res.sendStatus(204);
        });
    })
      .on('error', next)
      .end();
  }
}

module.exports = TimelineController;