const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcblope.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const postCollection = client.db('endGame').collection('posts');
    const userCollection = client.db('endGame').collection('users');
    const commentCollection = client.db('endGame').collection('comments');
    const userInfoCollection = client.db('endGame').collection('userInfo');

    try {
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })
        // this put methos has some problem i will fixed it later
        // this put methos has some problem i will fixed it later
        // this put methos has some problem i will fixed it later
        app.put('/post/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const post = await postCollection.findOne(filter);
            let loveReact;
            if (post.loveReact) {
                loveReact = post[loveReact] + 1;

            } else {
                loveReact = 1;
            }
            const updateDoc = {
                $set: {
                    loveReact,
                }
            }
            const result = await postCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/post', async (req, res) => {
            const query = {};
            const result = await postCollection.find(query).toArray();
            res.send(result);
        })
        app.put('/user', async (req, res) => {
            const user = req.body;
            const email = req.query.email;
            const options = { upsert: true };
            const filter = { email: email };
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.post('/comment', async (req, res) => {
            const comment = req.body;
            console.log(comment);
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        })
        app.get('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id };
            const comments = await commentCollection.find(query).toArray();
            res.send(comments);
        })
        app.get('/top-post', async (req, res) => {
            const query = {};
            const topPost = await postCollection.find(query).sort({ 'loveReact': -1 }).limit(3).toArray();
            res.send(topPost);
        })
    }
    finally {
        // no action 
    }
}
run().catch(err => { console.error(err) });


app.get('/', (req, res) => {
    res.send('media website server running')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})