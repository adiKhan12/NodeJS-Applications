const { application } = require('express');
const express = require('express'); // Extract express from the package
const {MongoClient} = require('mongodb'); // extract mongodb client from the package

const connectionString = 'mongodb://localhost:27017'; // Connection URL

async function init() {
    const client = new MongoClient(connectionString, {useUnifiedTopology: true}); // Create a new MongoClient
    await client.connect(); // Connect to the Server

    const app = express(); // Create a new express app

    app.get('/get', async (req, res) => {
        const db = await client.db("adoption"); // Select the database
        const collection = await db.collection("pets"); // Select the collection
        const pets = await collection.find({
            $text: { $search: req.query.search  // Search for the query
            }}
            ,
            {_id  : 0}  // Exclude the _id field
            ).sort({score: {$meta: "textScore"}}).limit(10).toArray(); // Find all the pets that match the search query
            res.json({status: 'success', pets}); // Send the pets as a JSON response
        });

        const port = 3000; // Port number
        app.use(express.static('./static')); // Serve the static folder
        app.listen(port, () => console.log(`Server listening on port ${port}`)); // Start the server on the port
    
}

init(); // Call the init function