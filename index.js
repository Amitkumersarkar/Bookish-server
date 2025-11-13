import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

// middleware
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.xqgbxlh.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // await client.connect();
        const booksCollection = client.db('Bookish').collection('books');

        // fetch all books data
        app.get('/books', async (req, res) => {
            const result = await booksCollection.find().toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log(' Connected to MongoDB!');
    } catch (error) {
        console.error(' MongoDB connection error:', error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.listen(port, () => {
    console.log(` Server running on port ${port}`);
});
