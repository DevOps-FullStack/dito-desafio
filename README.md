# Desafio DITO
> Requisitos
- [Docker](https://docs.docker.com/install/)
## Serviço de Autocomplete
> Iniciando o projeto com `docker-compose`
```
docker-compose up -d
```
> Mapeando o tipo do documento no [Elasticsearch](https://www.elastic.co/)

```
PUT localhost:9200/dito
{
  "mappings": {
    "events": {
      "properties": {
        "event": {
          "type": "completion"
        },
        "timestamp": {
          "type": "date"
        }
      }
    }
  }
}
```
> `API`
  - Endpoint para persistir os `eventos`
    ```
      POST localhost:3000/event
      {
        "event": "buy",
        "timestamp": "2016-09-22T13:57:31.2311892-04:00"
      }
    ```
  - Endpoint para serviço de `autocomplete`
    ```
      GET localhost:3000/event?search=bu
      ["buy"]
    ```
> Acessando pela [Web](http://localhost:3000)
## Manipulação de Dados

> Endpoint

```
GET localhost:3000/timeline
```

## Tecnologia utilizada
> Docker

> Nodejs

> Elasticsearch