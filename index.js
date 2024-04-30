const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*'
}));
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t9lecvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const todosCollection = client.db("TodoDB").collection("todos");

    // app post todo

    app.get("/todos",async(req, res) => {

      let query = {};

      if (req.query?.email) {

        query = {
          email: req.query?.email
        }
      }
    
      const result = await todosCollection.find(query).toArray();
      res.send(result)
    });

    app.get("/todos/:id",async(req, res) => {

       const id = req.params.id;

       const filter = {_id: new ObjectId(id)}
      const result =await todosCollection.findOne(filter);
     
      res.send(result)
    });


    app.post("/todos", async (req, res) => {
      const todo = req.body;
      const result = await todosCollection.insertOne(todo);
      res.send(result);
    });

    // deleting api

    app.delete('/todos/:id',async(req,res)=>{

          const id = req.params.id;
           
           const filter={_id : new ObjectId(id)}
      
          const result= await todosCollection.deleteOne(filter)

         res.send(result)
    })

    //     putting updating

    app.put('/todos/:id',async(req,res)=>{

        const id = req.params.id;
        const task = req.body;

         
         const filter={_id : new ObjectId(id)}
         const options = {upsert:true}
         const updateDoc = {
              
            $set:{

                 email : task.email,
                 title : task.title,
                 desc : task.desc,
              

            }
                   
         }
    
        const result= await todosCollection.updateOne(filter,updateDoc,options)

       res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
