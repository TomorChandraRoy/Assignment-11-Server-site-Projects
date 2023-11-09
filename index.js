const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//MidileWare
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.octeyq5.mongodb.net/?retryWrites=true&w=majority`;

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

    //DatabaseName and CollectionName
    const addJobsCollcetion = client.db("addJobsPostDB").collection("addjobs");
    const bidCollcetion = client.db("addJobsPostDB").collection("bid-data");

    app.get('/addjobs', async (req, res) => {
      const result = await addJobsCollcetion.find().toArray();
      res.send(result);

    })
    // ADD JOBS FORM aer data load 
    app.post('/addjobs', async (req, res) => {
      const addJob = req.body;
      console.log(addJob);
      const result = await addJobsCollcetion.insertOne(addJob);
      res.send(result);
    });

    // addjobs aer all data load server a 
    app.get("/getJobsbycategory/:category", async (req, res) => {
      const category = req.params.category;
      console.log(category);
      const filter = { category: category }
      const result = await addJobsCollcetion.find(filter).toArray();
      res.send(result);
    })
    app.get("/jonByEmail", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const filter = { email: email }
      const result = await addJobsCollcetion.find(filter).toArray();
      res.send(result);
    })
    app.get('/updateJob', async (req, res) => {
      const result = await addJobsCollcetion.find().toArray();
      res.send(result);
    })
    //update id load server
    app.get("/updateJob/:id", async (req, res) => {
      const update = await addJobsCollcetion.findOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(update);
      res.send(update);
    })
    app.get('/updateJob', async (req, res) => {
      const result = await addJobsCollcetion.find().toArray();
      res.send(result);
    })
    
    app.get('/singleData', async (req, res) => {
      const result = await addJobsCollcetion.find().toArray();
      res.send(result);
    })
    app.get('/singleData/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const result = await addJobsCollcetion.findOne(quary)
      res.send(result);
    })
    // DATA update method 
    app.patch("/updateJob/:id", async (req, res) => {
      const id = { _id: new ObjectId(req.params.id), }
      const body = req.body;
      console.log(body);
      const uodateData = {
        $set: {
          ...body
        },
      };
      const option = { upsert: true }
      const result = await addJobsCollcetion.updateOne(id, uodateData, option)
      res.send(result);
    })
    //delete method
    app.delete('/addjobs/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await addJobsCollcetion.deleteOne(quary)
      res.send(result)
    })
    // BID-DATA FORM aer data load method
    app.post('/bid-data', async (req, res) => {
      const addBid = req.body;
      console.log('bid added', addBid);
      const result = await bidCollcetion.insertOne(addBid);
      res.send(result);
    });
    // BID-DATA aer all data load server a 
    app.get("/bid-data", async (req, res) => {
      // console.log(req.query.userEmail);
      let quary={};
      if(req.query?.userEmail){
        quary={userEmail: req.query.userEmail}
      }
      const cursor = bidCollcetion.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    })
    // BID-DATA a UserEmail load
    app.get("/UserEmails", async (req, res) => {
      // console.log(req.query.userEmail);
      const cursor = bidCollcetion.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get method id
    app.get('/bid-data/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const result = await bidCollcetion.findOne(quary)
      res.send(result);
    })

   app.get('/bidrequest/:email', async(req,res) =>{
    const email =req.params.email
    const filter = {buyerEmail: email}
    const result = await bidCollcetion.find(filter).toArray();
    res.send(result)
   })

   app.patch('/updateStatus/:id', async(req,res)=>{
    const id = req.params.id;
    const {status} = req.body;
    const filter = {_id: new ObjectId(id)}
    const update = {
      $set:{
        status: status
      },
    }
    const result = await bidCollcetion.updateOne(filter, update)
    res.send(result)
   })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('ServerSITE')
})
// app lesten     
app.listen(port, () => {
  console.log(`Example app listening on port : ${port}`)
})
