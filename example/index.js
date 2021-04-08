const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const debug = require('debug')('s3DB');
const { db } = require('../index');
const app = express()
const port = 3030

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.get('/', (request, response) => {
  response.send({ message: 'Welcome! Follow instructions to checkout s3-document-db' });
})

app.get('/health', (request, response) => {
  response.send({ status: 'ok' });
})

app.get('/api/get', async (req, res) => {
  try {
    const jsonDocument = await db.getDocument({ database: "test-s3-db", collection: "settings", documentID: "doc2" });
    return res.send(jsonDocument);
  } catch (e) {
    return res.status(e.statusCode).send({
      error: e.message,
      status: e.statusCode,
      message: ""
    });
  }
});

app.post('/api/insert', async (req, res) => {
  try {
    const payload = req.body;
    debug({ payload });
    const params = {
      database: 'test-s3-db',
      collection: 'order_manager_settings',
      documentID: '1672',
      newDoc: payload,
      metaData: {
        ContentType: 'application/json'
      }
    }
    const data = await db.insert(params);
    return res.send({ status: 'ok', message: data });
  } catch (e) {
    return res.status(e.statusCode || 500).send({
      error: e.message,
      status: e.statusCode,
      message: ""
    });
  }
});


app.post('/api/update', async (req, res) => {
  try {
    const payload = req.body;
    debug({ payload });
    const params = {
      database: 'test-s3-db',
      collection: 'order_manager_settings',
      documentID: '1672',
      updateDoc: payload,
      metaData: {
        ContentType: 'application/json'
      }
    }
    const data = await db.update(params);
    return res.send({ status: 'ok', message: data });
  } catch (e) {
    return res.status(e.statusCode || 500).send({
      error: e.message,
      status: e.statusCode,
      message: ""
    });
  }
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})