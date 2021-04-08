const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config()
console.log(process.env.DB_NAME);
const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfjzb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('connection err', err)
  const foodCollection = client.db("halalFood").collection("food");
  console.log('Database connected yay!');
  
    app.get('/food', (req, res) => {
        foodCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

  app.post('/addFood', (req, res) => {
      const newFood = req.body;
      console.log('adding new Food: ', newFood)
      foodCollection.insertOne(newFood)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('deleteFood/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      console.log('delete this', id);
      foodCollection.findOneAndDelete({_id: id})
      .then(documents => res.send(!!documents.value))
  })

//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})