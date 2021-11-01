const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// mongodb starts
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qa19q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("tourism");
        const servicesCollection = database.collection("services");
        const hotelDatabase = client.db("hotelsCollection");
        const hotelsCollection = hotelDatabase.collection("hotels");
        const destinationsDatabase = client.db("destinationsCollection");
        const destinationsCollection = destinationsDatabase.collection("destinations");
        const orderDatabase = client.db("placeOrder");
        const orderCollection = orderDatabase.collection('orders');

        // GET API
        app.get('/services',async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);

        })

        // hotel api
          app.get('/hotels',async(req,res)=>{
              const cursor = hotelsCollection.find({});
              const hotels = await cursor.toArray();
              res.json(hotels);
          })

        //   destination api
        app.get('/destinations',async (req,res)=>{
            const cursor = destinationsCollection.find({});
            const destinations = await cursor.toArray();
            res.json(destinations);
        })

        // GET SINGLE  SERVICE
          app.get('/services/:id',async(req,res)=>{
              const id = req.params.id;
              const query = {_id: ObjectId(id)};
              const service = await servicesCollection.findOne(query);
              res.json(service);
          })





        // POST API
        // app.post('/services', async (req, res) => {
        //     const service = req.body;
        //     console.log('hit the post api',service);
        //     res.send('post hitted')
        //     const result = await servicesCollection.insertOne(service);
        //     console.log(result);
        //     res.json(result);
        // })
         
        // Delete Operation
        app.delete('/services/:id',async (req,res)=> {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);


        })
    //   Add Orders
    app.post('/orders',async(req,res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order)
        res.json(result)
    })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
// mongodb ends

app.get('/', (req, res) => {
 
    res.send('Running tourism website')
})

app.listen(port, () => {
    console.log('lisening to port', port);
})