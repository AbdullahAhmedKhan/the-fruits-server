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

        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories)
        });
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);

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
