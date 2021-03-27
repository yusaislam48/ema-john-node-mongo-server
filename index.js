const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(cors())
const port = 4000;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://emaJohndb:NUfKZfdRoEasoLpe@cluster0.qsbja.mongodb.net/emajohnStore?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME, process.env.DB_COLLECTION)


client.connect(err => {
  const productsCollection = client.db("emajohnStore").collection("products");
  const ordersCollection = client.db("emajohnStore").collection("orders");

  console.log('conected')

  app.post('/addProduct', (req, res)=>{
      const products = req.body;
      productsCollection.insertOne(products)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  });

  app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  app.get('/products/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents[0]);
    })
})

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys }})
        .toArray( (err, documents) => {
            res.send(documents);
        } )
    })

    app.post('/addOrder', (req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    });

});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})