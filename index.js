const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

//middle ware
app.use(cors())
app.use(express.json())

//check the root server
app.get('/', (req, res) => {

    res.send('sector manager server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ytkvvxy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        //db collection for sector
        const sectorCollection = client.db('sector-management').collection('sector')

        //db collection for user
        const userCollection = client.db('sector-management').collection('user')

        //post user data
        app.post('/userSector', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        //get sector data
        app.get('/sectors', async (req, res) => {

            const query = {}
            const result = await sectorCollection.find(query).toArray();
            res.send(result)
        })

        //get specific user sector field
        app.get('/mySector', async (req, res) => {

            const email = req.query.email
            const query = { email: email }
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })

        //get specific user by his/her id
        app.get('/mySector/update/:id', async (req, res) => {

            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })

        //update user
        app.put('/update/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const info = req.body;
            // console.log(reviews)
            const option = { upsert: true }
            const updateReview = {
                $set: {

                    name: info.name,
                    agrement: info.agrement,
                    sector: info.sector
                }
            }

            const result = await userCollection.updateOne(query, updateReview, option)
            res.send(result)
        })
    }

    finally {

    }
}
run().catch(console.dir)



app.listen(port, () => {

    console.log(`sector manager runs on port ${port}`)
})