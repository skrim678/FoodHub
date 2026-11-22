import pCategories from './data/pC.json' with {type: 'json'}

import pFood from './data/pFood.json' with{type: 'json'}
import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT;
const uri= process.env.MONGO_URI;

const app = express()
app.use(cors());
app.use(express.json())




const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function run(){
    try{
        await client.connect();
        await client.db('admin').command({ping:1})
        console.log("connection successfully")


        const db= client.db('foodHub');
        const pCategoriesCollection = db.collection('pCategories')
        const pFoodCollection =db.collection('p-Food')


        for (const category of pCategories) {
    await pCategoriesCollection.updateOne(
        { name: category.name },
        {
            $set: {
                image: category.image
            }
        },
        { upsert: true }

        // upsert: true মানে ক্যাটাগরি না থাকলে নতুন করে Insert করবে, আর থাকলে Update করবে।
    );
} 

for (const food of pFood) {
    await pFoodCollection.updateOne(
        { id: food.id },
        {
            $set: food
        },
        { upsert: true }
    );
}

    app.get('/categories', async (req, res) => {
    const result = await pCategoriesCollection.find().toArray();
    res.send(result);
    });

    app.get('/popular-food',async(req,res)=>{
      const result =await pFoodCollection.find().toArray();
      res.send(result)
    })

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});

    }
    finally{

    }
    
}
run()
