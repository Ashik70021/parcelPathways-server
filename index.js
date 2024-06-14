require('dotenv').config()
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@cluster0.tpk7gxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const userCollection = client.db("ParcelPathways").collection("users");
    const parcelsCollection = client.db("ParcelPathways").collection("bookingParcels");
    
    // Users related api
    app.get('/users', async(req, res) =>{
        const result = await userCollection.find().toArray();
        res.send(result);
    });
    app.get('/users/:email', async(req, res) =>{
        const email = req.params.email
        const result = await userCollection.findOne({email: email});
        res.send(result);
    });

    app.post('/users', async(req, res) =>{
        const user = req.body;
        // insert email if user doesn't exist
        const query = {email: user.email}
        const existingUser = await userCollection.findOne(query);
        if(existingUser){
          return res.send({message: "user already exist", insertedId: null})
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    // Parcel related api

    app.get('/bookingParcels', async (req, res) =>{
      const result = await parcelsCollection.find().toArray()
      res.send(result)
    })
    
    app.post('/bookingParcel', async(req, res) =>{
      const parcelData = req.body;
      const result = await parcelsCollection.insertOne(parcelData)
      res.send(result)
    })
    








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('ParcelPathways is sitting')
})

app.listen(port, ()=>{
    console.log(`Parcel Pathways is sittion on port ${port}`);
})