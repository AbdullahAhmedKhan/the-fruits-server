const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q40ku.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('theFruits').collection('fruits');
        // get inventory
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories)
        });
        // single items details
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);

        })

        // post one inventory item
        app.post('/inventory', async (req, res) => {
            const newInventory = req.body;
            const result = await inventoryCollection.insertOne(newInventory);
            res.send(result);
        })

        // delete inventory
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);

        })

        //delivery
        app.put('/inventory/decrease/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.updateOne(query, {
                $inc: { quantity: -1 }
            })
        })
        //restock
        app.put('/inventory/increase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const quantity = parseInt(req.body.quantity);
            const inventory = await inventoryCollection.findOne(query);
            const newQuantity = quantity + inventory.quantity;
        })


    }
    finally {

    }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('Running The Fruits Server');
});

app.listen(port, () => {
    console.log('Listening to port: ', port);
})
